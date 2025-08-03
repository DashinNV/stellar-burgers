describe('Главная страница доступна', () => {
  it('сервис успешно загружается по адресу localhost:4000', () => {
    cy.visit('http://localhost:4000');
  });
});

describe('Перехват и корректная подменавсех API-запросов ингредиентов и заказов"', () => {
  it('Корректно подменяются запросы к эндпоинтам ингредиентов и заказов', () => {
    cy.fetchs();    
    cy.localhost();    
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
  });
});

describe('Функциональность конструктора бургера', () => {
  it('Пользователь может добавить булку и начинку в конструктор', () => {
    cy.fetchs();
    cy.localhost();    
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`).contains('Добавить').click();
    cy.get(`[data-cy=643d69a5c3f7b9001cfa0941]`).contains('Добавить').click();
    cy.get(`[data-cy=bunTop]`).should('exist').contains('булка');
    cy.get(`[data-cy=bunBottom]`)
      .should('exist')
      .contains('булка');
    cy.get(`[data-cy=mainFilling]`).should('exist').contains('котлета');
  });
});

describe('Поведение модальных окон с деталями ингредиентов', () => {
  beforeEach(() => {
    cy.fetchs();
    cy.localhost();
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');
  });

  it('открытие модального окна при клике на ингредиент', () => {
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`).click();
    cy.get(`[data-cy=modal]`).should('be.visible');
  });

  it('закрытие по клику на x', () => {
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`).click();
    cy.get(`[data-cy=modalClose]`).click();
    cy.get(`[data-cy=modal]`).should('not.exist');
  });

  it('закрытие по нажатию Esc', () => {
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`).click();
    cy.get('body').type('{esc}');
    cy.get(`[data-cy=modal]`).should('not.exist');
  });
});

describe('Процесс создания заказа с авторизацией', () => {
  it('Пользователь авторизуется, выбирает ингредиенты и успешно оформляет заказ', () => {
    cy.fetchs();
    cy.visit('http://localhost:4000/login');

    // Ждем загрузки ингредиентов и заказов
    cy.wait('@ingredientStub');
    cy.wait('@ordersStub');

    // Кликаем по кнопке Войти    
    cy.get('body').contains('Войти').click();

    // Ждем авторизацию пользователя
    cy.wait('@userDataStub');
  
    // Добавляем ингредиенты в конструктор
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093c]`).contains('Добавить').click();
    cy.get(`[data-cy=643d69a5c3f7b9001cfa0941]`).contains('Добавить').click();
    cy.get(`[data-cy=643d69a5c3f7b9001cfa093e]`).contains('Добавить').click();

    // Оформляем заказ
    cy.get(`[data-cy=orderBtn]`).click();

    // Ждем ответ по созданию заказа
    cy.wait('@orderStub');

    // Проверяем, что модальное окно с номером заказа открылось
    cy.get('[data-cy=modal]').should('be.visible') .should('contain.text', '85716');
    
    cy.get('[data-cy=modal]').should('be.visible')
      .invoke('text')
      .then(text => {
        expect(text).to.match(/\d{5}/); // число из 5+ цифр
      });

    // Закрываем модальное окно
    cy.get('body').type('{esc}');
    cy.get(`[data-cy=modal]`).should('not.exist');

    // Проверяем, что конструктор пуст (булки и начинка)
    cy.get(`[data-cy=bunTop]`).contains('div', 'Выберите булки');
    cy.get(`[data-cy=mainFilling]`).contains('div', 'Выберите начинку');
    cy.get(`[data-cy=bunBottom]`).contains('div', 'Выберите булки');
  });
});