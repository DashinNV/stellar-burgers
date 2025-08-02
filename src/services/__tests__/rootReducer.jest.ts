import { rootReducer } from '../../services/store';
import { initialState as ingredientsInitialState } from '../../services/ingredients/ingredientsSlice';
import { initialState as orderInitialState } from '../../services/order/orderSlice';
import { initialState as userInitialState } from '../../services/user/userSlice';
import { initialState as feedInitialState } from '../../services/feed/feedSlice';

describe('rootReducer initialization', () => {
  it('should return the initial state of all slices', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      order: orderInitialState,
      user: userInitialState,
      feed: feedInitialState,
    });
  });
});
