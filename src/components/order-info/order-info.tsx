import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from 'react-redux';
import { orderDataSelector } from '../../services/feed/feedSlice';
import { ingredientsSelector } from '../../services/ingredients/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { getFeedById } from '../../services/feed/feedActions';

export const OrderInfo: FC = () => {
  const orderData = useSelector(orderDataSelector);
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderId) {
      dispatch(getFeedById(Number(orderId)));
    }
  }, [dispatch, orderId]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
