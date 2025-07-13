import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TOrder } from '@utils-types';
import { postOrder } from '../order/orderAction';

interface orderState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null | undefined;
  orderData: TOrder | null;
  lastOrder: TOrder | null;
  sendingOrder: boolean;
}

const initialState: orderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
  orderData: null,
  lastOrder: null,
  sendingOrder: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearLastOrder(state) {
      state.lastOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.sendingOrder = true;
        state.error = null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.sendingOrder = false;
        state.error = action.error.message;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.sendingOrder = false;
        state.lastOrder = action.payload.order;
      });
  }
});

export const ordersSelector = (state: RootState) => state.order.orders;

export const orderIsSending = (state: RootState) => state.order.sendingOrder;

export const lastOrder = (state: RootState) => state.order.lastOrder;

export const { clearLastOrder } = orderSlice.actions;

export const reducer = orderSlice.reducer;
