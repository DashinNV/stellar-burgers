import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getFeeds, getFeedById } from '../../services/feed/feedActions';

interface feedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null | undefined;
  orderData: TOrder | null;
}

const initialState: feedState = {
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

export const ordersSelector = (state: { feed: feedState }) => state.feed.orders;
export const feedsIsLoading = (state: { feed: feedState }) =>
  state.feed.isLoading;
export const totalOrderSelector = (state: { feed: feedState }) =>
  state.feed.total;
export const totalTodayOrderSelector = (state: { feed: feedState }) =>
  state.feed.totalToday;
export const orderDataSelector = (state: { feed: feedState }) =>
  state.feed.orderData;

export const reducer = feedSlice.reducer;
