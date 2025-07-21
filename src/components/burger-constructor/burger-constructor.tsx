import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearConstructor,
  constructorBunSelector,
  constructorIngredientsSelector
} from '../../services/ingredients/ingredientsSlice';
import {
  orderIsSending,
  lastOrder,
  clearLastOrder
} from '../../services/order/orderSlice';
import { postOrder } from '../../services/order/orderAction';
import { useDispatch, useSelector } from '../../services/store';
import { userAuthSelector } from '../../services/user/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(userAuthSelector);

  const constructorItems = {
    bun: useSelector(constructorBunSelector),
    ingredients: useSelector(constructorIngredientsSelector)
  };

  const orderRequest = useSelector(orderIsSending);

  const orderModalData = useSelector(lastOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      if (!constructorItems.bun) {
        alert('Необходимо выбрать булку!');
      }
      return;
    }

    if (!isAuth) {
      navigate('/login');
      return;
    }

    const orderArray: string[] = [];
    orderArray.push(constructorItems.bun._id);
    constructorItems.ingredients.forEach((item) => orderArray.push(item._id));
    dispatch(postOrder(orderArray)).then(() => dispatch(clearConstructor()));
  };
  const closeOrderModal = () => {
    dispatch(clearLastOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
