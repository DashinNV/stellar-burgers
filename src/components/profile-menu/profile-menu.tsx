import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { userAuthSelector } from '../../services/user/userSlice';
import { logoutUser } from '../../services/user/userAction';
import { Navigate } from 'react-router-dom';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isAuth = useSelector(userAuthSelector);
  const handleLogout = () => dispatch(logoutUser());

  if (!isAuth) return <Navigate replace to='/login' />;

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
