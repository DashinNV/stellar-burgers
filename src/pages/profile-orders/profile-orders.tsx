import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { userOrdersSelector } from '../../services/order/orderSlice';
import { getUserOrders } from '../../services/order/orderAction';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const userOrders: TOrder[] = useSelector(userOrdersSelector);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={userOrders} />;
};
