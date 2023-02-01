import { Avatar, Button, Card } from 'antd';
import Router from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';
import { END } from 'redux-saga';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

import cookie from 'cookie';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logoutLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.member_id)) {
      Router.push('/');
    }
  }, [me && me.member_id]);
  // if (!me) {
  //   return null;
  // }

  const onLogOut = useCallback(() => {
    dispatch(logoutRequestAction());
  });

  return (
    <Card>
      <Card.Meta
        avatar={<Avatar>{me.username}</Avatar>}
        title={me.username}
        style={{ padding: 10 }}
      />
      <Button onClick={onLogOut} loading={logoutLoading}>
        로그아웃
      </Button>
    </Card>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const parsedCookie = context.req
      ? cookie.parse(context.req.headers.cookie || '')
      : '';
    if (context.req && parsedCookie) {
      if (parsedCookie['accessToken']) {
        context.store.dispatch({
          type: LOAD_MY_INFO_REQUEST,
          data: parsedCookie['accessToken'],
        });
      }
    }
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default UserProfile;
