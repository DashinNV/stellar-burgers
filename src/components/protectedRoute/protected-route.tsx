import React from 'react';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from '../../services/store';
import {
  errorSelector,
  userAuthSelector,
  userIsLoading,
  clearErrors
} from '../../services/user/userSlice';
import { Modal } from '@components';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(userAuthSelector);
  const isLoading = useSelector(userIsLoading);
  const error = useSelector(errorSelector);
  const location = useLocation();
  // Обработчик закрытия модального окна ошибки
  const handleErrorClose = React.useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Modal title='Пожалуйста, подождите...' onClose={() => {}}>
        <Preloader />
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        title={`При выполнении запроса возникла ошибка: ${error}`}
        onClose={handleErrorClose}
      />
    );
  }

  // Если страница для неавторизованных, но пользователь авторизован — редирект назад или на '/'
  if (onlyUnAuth && isAuth) {
    const from = (location.state as { from?: Location })?.from ?? {
      pathname: '/'
    };
    return <Navigate to={from} replace />;
  }

  // Если страница для авторизованных, но пользователь не авторизован — редирект на логин
  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};
