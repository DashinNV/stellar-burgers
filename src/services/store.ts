import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducer as ingredientsReducer } from './ingredients/ingredientsSlice';
import { reducer as orderReducer } from './order/orderSlice';
import { reducer as userReducer } from './user/userSlice';
import { reducer as feedReducer } from './feed/feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export { rootReducer };

export default store;
