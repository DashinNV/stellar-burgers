jest.mock('../../utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  refreshToken: jest.fn(),
  updateUserApi: jest.fn(),
}));

jest.mock('../../utils/cookie', () => ({ setCookie: jest.fn() }));

import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';
import * as mock from '../../__mocks__/userData.json';

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
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
  refreshUserToken,
  updateUserData
} from '../../services/user/userAction'

import { reducer, clearErrors } from '../../services/user/userSlice';

const userData = {
  email: mock.user.email,
  name: mock.user.name,
  password: 'password'
};

const initialState = {
  user: mock.user,
  isLoading: false,
  isAuth: false,
  error: null
};

function setupStore() {
  return configureStore({
    reducer: {
      user: reducer,
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

describe('user slice', () => {
  it('Registration (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: mock.accessToken,
      user: { email: mock.user.email, name: mock.user.name }
    };
    const spy = jest.spyOn(api, 'registerUserApi').mockResolvedValue(expectedResult);

    expect(store.getState().user.isLoading).toBeFalsy();

    const promise = dispatch(registerUser(userData));

    expect(store.getState().user.isLoading).toBeTruthy();

    await promise;

    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;
    expect(user).toEqual(expectedResult.user);
  });

  it('Registration (rejected)', async () => {
    const expectedError = new Error('Registration failed');

    const spy = jest.spyOn(api, 'registerUserApi').mockRejectedValue(expectedError);

    expect(store.getState().user.isLoading).toBeFalsy();

    const promise = dispatch(registerUser(userData));

    expect(store.getState().user.isLoading).toBeTruthy();

    await promise;

    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { error } = store.getState().user;
    expect(error).toEqual(expectedError.message);
  });

  it('Login (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: mock.accessToken,
      user: { email: mock.user.email, name: mock.user.name }
    };

    const spy = jest.spyOn(api, 'loginUserApi').mockResolvedValue(expectedResult);

    await dispatch(loginUser(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  it('Login (rejected)', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest.spyOn(api, 'loginUserApi').mockRejectedValue(expectedResult);

    await dispatch(loginUser(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  it('Logout (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest.spyOn(api, 'logoutApi').mockResolvedValue(expectedResult);

    await dispatch(logoutUser());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  it('Logout (rejected)', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: '',
      user: { email: '', name: '' }
    };

    const spy = jest.spyOn(api, 'logoutApi').mockRejectedValue(expectedResult);

    await dispatch(logoutUser());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult.user);
  });

  it('Get user info (fulfilled)', async () => {
    const expectedResult = {
      email: mock.user.email,
      name: mock.user.name
    };

    const spy = jest
      .spyOn(api, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ success: true, user: { ...expectedResult } })
      );

    await dispatch(getUserInfo());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  it('Get user info', async () => {
    const expectedResult = {
      error: undefined,
      email: '',
      name: ''
    };

    const spy = jest
      .spyOn(api, 'getUserApi')
      .mockImplementation(() =>
        Promise.reject({ success: false, user: { ...expectedResult } })
      );

    await dispatch(getUserInfo());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  it('Refresh token (fulfilled)', async () => {
    const expectedResult = {
      success: true,
      refreshToken: mock.refreshToken,
      accessToken: mock.accessToken
    };

    const spy = jest.spyOn(api, 'refreshToken').mockResolvedValue(expectedResult);

    await dispatch(refreshUserToken());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      expectedResult.refreshToken
    );
  });

  it('Refresh token', async () => {
    const expectedResult = {
      success: false,
      refreshToken: mock.refreshToken,
      accessToken: ''
    };

    const spy = jest.spyOn(api, 'refreshToken').mockRejectedValue(expectedResult);

    await dispatch(refreshUserToken());
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    expect(localStorage.setItem).toHaveBeenCalledTimes(3);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      expectedResult.refreshToken
    );
  });

  it('Update user data (fulfilled)', async () => {
    const expectedResult = {
      email: mock.user.email,
      name: mock.user.name
    };

    const spy = jest
      .spyOn(api, 'updateUserApi')
      .mockImplementation(() =>
        Promise.resolve({ success: true, user: { ...expectedResult } })
      );

    await dispatch(updateUserData(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(1);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  it('Update user data (rejected)', async () => {
    const expectedResult = {
      error: undefined,
      email: '',
      name: ''
    };

    const spy = jest
      .spyOn(api, 'updateUserApi')
      .mockImplementation(() =>
        Promise.reject({ success: true, user: { ...expectedResult } })
      );

    await dispatch(updateUserData(userData));
    expect(store.getState().user.isLoading).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);

    const { user } = store.getState().user;

    expect(user).toEqual(expectedResult);
  });

  it('Clear error', () => {
    const newState = reducer(initialState, clearErrors());
    expect(newState.error).toEqual(null);
  });
});