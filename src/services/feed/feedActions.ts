import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';

export const getFeeds = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export const getFeedById = createAsyncThunk(
  'feeds/getOne',
  async (id: number) => getOrderByNumberApi(id)
);
