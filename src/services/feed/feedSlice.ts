import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeeds, getFeedById } from '../../services/feed/feedActions';
import { RootState } from '../store';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null | undefined;
  orderData: TOrder | null;
}

export const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
  orderData: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedById.pending, (state) => {
        state.error = null;
        state.orderData = null;
      })
      .addCase(getFeedById.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(getFeedById.fulfilled, (state, action) => {
        state.orderData = action.payload.orders[0];
      });
  }
});

export const ordersSelector = (state: RootState) => state.feed.orders;
export const feedsIsLoading = (state: RootState) => state.feed.isLoading;
export const totalOrderSelector = (state: RootState) => state.feed.total;
export const totalTodayOrderSelector = (state: RootState) =>
  state.feed.totalToday;
export const orderDataSelector = (state: RootState) => state.feed.orderData;

export const getOrderByNumber = createSelector(
  [
    (state: RootState) => state.feed.orders,
    (_: RootState, number: number) => number
  ],
  (orders: TOrder[], number: number): TOrder | undefined =>
    orders.find((order) => order.number === number)
);

export const reducer = feedSlice.reducer;
