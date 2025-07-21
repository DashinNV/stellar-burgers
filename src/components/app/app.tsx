import React, { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import { ProtectedRoute } from '../protectedRoute/protected-route';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/ingredients/ingredientsActions';
import { getFeeds } from '../../services/feed/feedActions';
import { getUserInfo } from '../../services/user/userAction';
import { userAuthSelector } from '../../services/user/userSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background =
    location.state && (location.state as { background?: Location }).background;
  const isAuth = useSelector(userAuthSelector);

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getFeeds());
    if (isAuth) {
      dispatch(getUserInfo());
    }
  }, [dispatch, isAuth]);

  const authProtected = (element: React.ReactElement, onlyUnAuth = false) => (
    <ProtectedRoute onlyUnAuth={onlyUnAuth}>{element}</ProtectedRoute>
  );

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={authProtected(<Login />, true)} />
        <Route path='/register' element={authProtected(<Register />, true)} />
        <Route
          path='/forgot-password'
          element={authProtected(<ForgotPassword />, true)}
        />
        <Route
          path='/reset-password'
          element={authProtected(<ResetPassword />, true)}
        />

        <Route path='/profile'>
          <Route index element={authProtected(<Profile />)} />
          <Route path='orders' element={authProtected(<ProfileOrders />)} />
          <Route path='orders/:number' element={authProtected(<OrderInfo />)} />
        </Route>

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна при наличии background */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
