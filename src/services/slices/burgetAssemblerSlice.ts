import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

type TBurgerAssemblerState = {
  burgerAssembler: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  error: string | null;
};

const initialState: TBurgerAssemblerState = {
  burgerAssembler: {
    bun: null,
    ingredients: []
  },
  error: null
};

const burgerAssemblerSlice = createSlice({
  name: 'burgerAssembler',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burgerAssembler.bun = action.payload;
        } else {
          state.burgerAssembler.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    upIngredient: (state, action: PayloadAction<number>) => {
      const array = state.burgerAssembler.ingredients;
      const index = action.payload;

      // Проверяем, можем ли переместить ингредиент вверх
      if (index > 0) {
        const ingredientToMove = array[index];
        array.splice(index, 1); // Удаляем ингредиент из текущей позиции
        array.splice(index - 1, 0, ingredientToMove); // Вставляем ингредиент на новую позицию
      }
    },
    downIngredient: (state, action: PayloadAction<number>) => {
      const array = state.burgerAssembler.ingredients;
      const index = action.payload;

      // Проверяем, можем ли переместить ингредиент вниз
      if (index < array.length - 1) {
        const ingredientToMove = array[index];
        array.splice(index, 1); // Удаляем ингредиент из текущей позиции
        array.splice(index + 1, 0, ingredientToMove); // Вставляем ингредиент на новую позицию
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.burgerAssembler.ingredients =
        state.burgerAssembler.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },
    clearburgerAssembler: (state) => {
      state.burgerAssembler.bun = null;
      state.burgerAssembler.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  clearburgerAssembler
} = burgerAssemblerSlice.actions;

export const burgerAssemblerSelector = (state: RootState) =>
  state.burgerAssembler.burgerAssembler;

export default burgerAssemblerSlice.reducer;
