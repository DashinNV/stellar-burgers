import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { RootState } from '../store';
import { getIngredients } from './ingredientsActions';

interface ingredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null | undefined;
  constructorItems: TConstructorIngredient[];
}

export const initialState: ingredientsState = {
  ingredients: [],
  isLoading: true,
  error: null,
  constructorItems: []
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.constructorItems = state.constructorItems.filter(
            (item) => item.type !== 'bun'
          );
        }

        state.constructorItems.push(ingredient);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: `${ingredient._id}-${(crypto as any).randomUUID()}`
        }
      })
    },
    removeIngredient(
      state,
      action: PayloadAction<TConstructorIngredient['id']>
    ) {
      state.constructorItems = state.constructorItems.filter(
        (item) => item.id !== action.payload
      );
    },
    riseItem(state, action: PayloadAction<TConstructorIngredient['id']>) {
      const id = action.payload;
      const index = state.constructorItems.findIndex((item) => item.id === id);
      if (index > 0) {
        [state.constructorItems[index - 1], state.constructorItems[index]] = [
          state.constructorItems[index],
          state.constructorItems[index - 1]
        ];
      }
    },

    lowerItem(state, action: PayloadAction<TConstructorIngredient['id']>) {
      const id = action.payload;
      const index = state.constructorItems.findIndex((item) => item.id === id);
      if (index >= 0 && index < state.constructorItems.length - 1) {
        [state.constructorItems[index], state.constructorItems[index + 1]] = [
          state.constructorItems[index + 1],
          state.constructorItems[index]
        ];
      }
    },

    clearConstructor(state) {
      state.constructorItems = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;

export const ingredientsIsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;

export const constructorItemsSelector = (state: RootState) =>
  state.ingredients.constructorItems;

export const bunsSelector = createSelector(ingredientsSelector, (ingredients) =>
  ingredients.filter((item) => item.type === 'bun')
);

export const mainsSelector = createSelector(
  ingredientsSelector,
  (ingredients) => ingredients.filter((item) => item.type === 'main')
);

export const saucesSelector = createSelector(
  ingredientsSelector,
  (ingredients) => ingredients.filter((item) => item.type === 'sauce')
);

export const constructorBunSelector = (state: RootState) =>
  state.ingredients.constructorItems.find((item) => item.type === 'bun');

export const constructorIngredientsSelector = (state: RootState) =>
  state.ingredients.constructorItems.filter((item) => item.type !== 'bun');

export const {
  addIngredient,
  removeIngredient,
  riseItem,
  lowerItem,
  clearConstructor
} = ingredientsSlice.actions;

export const reducer = ingredientsSlice.reducer;
