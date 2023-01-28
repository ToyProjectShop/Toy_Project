import { Avatar, Button, Card } from 'antd';
import Router from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logoutLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);
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

export default UserProfile;
