import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../services/store';
import { getFeeds } from '../../services/feed/feedActions';
import { feedsIsLoading, ordersSelector } from '../../services/feed/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(ordersSelector);
  const isLoading = useSelector(feedsIsLoading);

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (isLoading) return <Preloader />;
  
  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
