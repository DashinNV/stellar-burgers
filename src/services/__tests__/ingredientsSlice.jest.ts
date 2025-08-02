import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import * as mock from '../../__mocks__/ingredients.json'

import {
  getIngredients
} from '../../services/ingredients/ingredientsActions';

import {
  reducer,
  addIngredient,
  removeIngredient,
  riseItem,
  lowerItem,
  clearConstructor
} from '../../services/ingredients/ingredientsSlice';

function setupStore() {
  return configureStore({
    reducer: {
      ingredients: reducer,
    },
  });
}

type TestStore = ReturnType<typeof setupStore>;
type TestDispatch = TestStore['dispatch'];

let store: TestStore;
let dispatch: TestDispatch;

beforeEach(() => {
  store = setupStore();
  dispatch = store.dispatch;
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('ingrents slice', () => {
  const initialState = {
    ingredients: mock.data,
    isLoading: false,
    error: null,
    constructorItems: [
      {
        _id: "643d69a5c3f7b9001cfa0941",
        name: "Биокотлета из марсианской Магнолии",
        type: "main",
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: "https://code.s3.yandex.net/react/code/meat-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
        id: 'ingredient2'
      },
      {
        _id: "643d69a5c3f7b9001cfa093e",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-03.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
        id: "ingredient3"
      },
    ]
  };

  it('Get ingredients (fulfilled)', async () => {
    const expectedResult = initialState.ingredients;

    const spy = jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(expectedResult);

    expect(store.getState().ingredients.isLoading).toBeTruthy();
    await dispatch(getIngredients());
    expect(store.getState().ingredients.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { ingredients } = store.getState().ingredients;

    expect(ingredients).toEqual(expectedResult);
  });

  it('Get ingredients (rejected)', async () => {
    const expectedResult = { error: undefined };

    const spy = jest.spyOn(api, 'getIngredientsApi').mockRejectedValue(expectedResult);

    expect(store.getState().ingredients.isLoading).toBeTruthy();
    await dispatch(getIngredients());
    expect(store.getState().ingredients.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { error } = store.getState().ingredients;

    expect(error).toEqual(expectedResult.error);
  });

  it('Add ingredient', () => {
    const newState = reducer(
      initialState,
      addIngredient({
        _id: "643d69a5c3f7b9001cfa0942",
        name: "Соус Spicy-X",
        type: "sauce",
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: "https://code.s3.yandex.net/react/code/sauce-02.png",
        image_mobile: "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/sauce-02-large.png"
      })
    );

    const result: {}[] = [];

    newState.constructorItems.forEach((item) => {
      const temp = Object.entries(item);
      temp.pop();
      result.push(Object.fromEntries(temp));
    });

    const expectedResult = [
      {
        _id: "643d69a5c3f7b9001cfa0941",
        name: "Биокотлета из марсианской Магнолии",
        type: "main",
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: "https://code.s3.yandex.net/react/code/meat-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png"
      },
      {
        _id: "643d69a5c3f7b9001cfa093e",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-03.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png"
      },
      {
       _id: "643d69a5c3f7b9001cfa0942",
        name: "Соус Spicy-X",
        type: "sauce",
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: "https://code.s3.yandex.net/react/code/sauce-02.png",
        image_mobile: "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/sauce-02-large.png" 
      }
    ];
    expect(result).toEqual(expectedResult);
  });

  it('Remove ingredient', () => {
    const newState = reducer(initialState, removeIngredient('ingredient2'));

    const result: {}[] = [];

    newState.constructorItems.forEach((item) => {
      const temp = Object.entries(item);
      temp.pop();
      result.push(Object.fromEntries(temp));
    });

    const expectedResult = [
      {
        _id: "643d69a5c3f7b9001cfa093e",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-03.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png"
      },
    ];

    expect(result).toEqual(expectedResult);
  });

  it(`Rise item`, () => {
    const newState = reducer(initialState, riseItem('ingredient3'));

    const expectedResult = [
      {
        _id: "643d69a5c3f7b9001cfa093e",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-03.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
        id: "ingredient3"
      },
      {
        _id: "643d69a5c3f7b9001cfa0941",
        name: "Биокотлета из марсианской Магнолии",
        type: "main",
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: "https://code.s3.yandex.net/react/code/meat-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
        id: 'ingredient2'
      },
    ];

    expect(newState.constructorItems).toEqual(expectedResult);
  });

  it(`Lower item`, () => {
    const newState = reducer(initialState, lowerItem('ingredient2'));

    const expectedResult = [
      {
        _id: "643d69a5c3f7b9001cfa093e",
        name: "Филе Люминесцентного тетраодонтимформа",
        type: "main",
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: "https://code.s3.yandex.net/react/code/meat-03.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-03-large.png",
        id: "ingredient3"
      },
      {
        _id: "643d69a5c3f7b9001cfa0941",
        name: "Биокотлета из марсианской Магнолии",
        type: "main",
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: "https://code.s3.yandex.net/react/code/meat-01.png",
        image_mobile: "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        image_large: "https://code.s3.yandex.net/react/code/meat-01-large.png",
        id: 'ingredient2'
      },
    ];

    expect(newState.constructorItems).toEqual(expectedResult);
  });

  it(`Clear constructor`, () => {
    const newState = reducer(initialState, clearConstructor());

    expect(newState.constructorItems).toEqual([]);
  });
});
