import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

import {
  postOrder
} from '../../services/order/orderAction'

import { reducer, clearLastOrder, initialState } from '../../services/order/orderSlice';

function setupStore() {
  return configureStore({
    reducer: {
      order: reducer,
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
});

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});


describe('order slice', () => {
  it('Sending order (fulfilled)', async () => {
    const expectedResult = {
      _id: '123456789012345678901234',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
      status: 'done',
      name: 'Test order',
      createdAt: '2025-08-01T00:00:00.000Z',
      updatedAt: '2025-08-01T00:00:00.000Z',
      number: 85543
    };

    const spy = jest.spyOn(api, 'orderBurgerApi').mockImplementation(() =>
      Promise.resolve({
        success: true,
        name: 'New',
        order: { ...expectedResult }
      })
    );

    await dispatch(
      postOrder(['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'])
    );
    expect(store.getState().order.sendingOrder).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { lastOrder } = store.getState().order;

    expect(lastOrder).toEqual(expectedResult);
  });

  it('Sending order (rejected)', async () => {
    const order = {
      _id: '123456789012345678901234',
      ingredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'],
      status: 'done',
      name: 'Test order',
      createdAt: '2025-08-01T00:00:00.000Z',
      updatedAt: '2025-08-01T00:00:00.000Z',
      number: 85543
    };

    const spy = jest
      .spyOn(api, 'orderBurgerApi')
      .mockImplementation(() =>
        Promise.resolve({ success: true, name: 'New', order: { ...order } })
      );

    await dispatch(
      postOrder(['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4'])
    );
    expect(store.getState().order.sendingOrder).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { error } = store.getState().order;

    expect(error).toEqual(null);
  });

  it ('Clear last order', () => {
    const newState = reducer(initialState, clearLastOrder());
      expect(newState.lastOrder).toEqual(null);
  });
});
