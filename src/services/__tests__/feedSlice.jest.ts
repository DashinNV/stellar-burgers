import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import * as mock from '../../__mocks__/orders.json';

import { getFeeds, getFeedById } from '../../services/feed/feedActions';
import { reducer } from '../../services/feed/feedSlice';

function setupStore() {
  return configureStore({
    reducer: {
      feeds: reducer,
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

afterAll(() => {
  jest.restoreAllMocks();
});

describe('feed slice', () => {
  const initialState = mock;

  it('Get feeds (fulfilled)', async () => {
    const expectedResult = initialState;

    const spy = jest.spyOn(api, 'getFeedsApi').mockResolvedValue(expectedResult);

    expect(store.getState().feeds.isLoading).toBeTruthy();
    await dispatch(getFeeds());
    expect(store.getState().feeds.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { orders } = store.getState().feeds;

    expect(orders).toEqual(expectedResult.orders);
  });

  it('Get feeds (rejected)', async () => {
    const expectedResult = { error: undefined };

    const spy = jest.spyOn(api, 'getFeedsApi').mockRejectedValue(expectedResult);

    expect(store.getState().feeds.isLoading).toBeTruthy();
    await dispatch(getFeeds());
    expect(store.getState().feeds.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().feeds;

    expect(error).toEqual(expectedResult.error);
  });

  it('Get feed by id (fulfilled)', async () => {
    const expectedResult = initialState;

    const spy = jest.spyOn(api, 'getOrderByNumberApi').mockResolvedValue(expectedResult);


    await dispatch(getFeedById(85520));
    expect(spy).toHaveBeenCalledTimes(1);

    const { orderData } = store.getState().feeds;

    expect(orderData).toEqual(
      expectedResult.orders.find((item) => item.number === 85520)
    );
  });

  it('Get feed by id', async () => {
    const expectedResult = { ...initialState, error: undefined };

    const spy = jest.spyOn(api, 'getOrderByNumberApi').mockRejectedValue(expectedResult);

    await dispatch(getFeedById(85520));
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().feeds;

    expect(error).toEqual(expectedResult.error);
  });
});
