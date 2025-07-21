import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

export const postOrder = createAsyncThunk(
  'user/newOrder',
  async (ingr: string[]) => orderBurgerApi(ingr)
);
