import ingredients from '../../src/__mocks__/ingredients.json';
import orders from '../../src/__mocks__/orders.json';
import userData from '../../src/__mocks__/userData.json';
import createOrder from '../../src/__mocks__/createOrder.json';

Cypress.Commands.add('localhost', () => {
  cy.visit('http://localhost:4000');
});

Cypress.Commands.add('fetchs', () => {
  cy.intercept('https://norma.nomoreparties.space/api/ingredients', (req) => {
    req.reply({ body: ingredients });
  }).as('ingredientStub');

  cy.intercept('https://norma.nomoreparties.space/api/orders/all', (req) => {
    req.reply({ body: orders });
  }).as('ordersStub');

  cy.intercept('https://norma.nomoreparties.space/api/auth/login', (req) => {
      req.reply({ body: userData });
    }).as('userDataStub');

  cy.intercept('https://norma.nomoreparties.space/api/orders', (req) => {
    req.reply({ body: createOrder });
  }).as('orderStub');
});

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }