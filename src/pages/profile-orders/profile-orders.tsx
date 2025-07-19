import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { ordersSelector } from '../../services/feed/feedSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(ordersSelector);
  const userOrders = orders;
  return <ProfileOrdersUI orders={userOrders} />;
};
