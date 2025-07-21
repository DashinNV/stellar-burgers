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
import { setCookie } from '../../utils/cookie';

export const getUserInfo = createAsyncThunk('user/getInfo', getUserApi);

export const updateUserData = createAsyncThunk(
  'user/newData',
  async (data: TRegisterData) => updateUserApi(data)
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'user/getToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
