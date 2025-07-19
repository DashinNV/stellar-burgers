import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userDataSelector } from '../../services/user/userSlice';

export const AppHeader: FC = () => {
  const name = useSelector(userDataSelector).name;
  return <AppHeaderUI userName={name} />;
};
