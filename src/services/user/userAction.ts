import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TRegisterData,
  updateUserApi,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi,
  getUserApi,
  refreshToken
} from '../../utils/burger-api';

export const getUserInfo = createAsyncThunk(
  'user/getInfo',
  async () => await getUserApi()
);

export const updateUserData = createAsyncThunk(
  'user/newData',
  async (data: TRegisterData) => await updateUserApi(data)
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const refreshUserToken = createAsyncThunk(
  'user/getToken',
  async () => await refreshToken()
);
