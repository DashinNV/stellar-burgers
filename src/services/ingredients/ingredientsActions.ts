import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export const getIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);
