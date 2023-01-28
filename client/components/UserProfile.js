import { Avatar, Button, Card } from 'antd';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { logoutAction } from '../reducers/user';

const UserProfile = () => {
  const dispatch = useDispatch();

  const onLogOut = useCallback(() => {
    dispatch(logoutAction());
  });

  return (
    <Card actions={[<div>회원정보 수정</div>]}>
      <Card.Meta
        avatar={<Avatar>AA</Avatar>}
        title="test"
        style={{ padding: 10 }}
      />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
