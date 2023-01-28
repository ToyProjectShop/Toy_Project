import { Avatar, Button, Card } from 'antd';
import { useCallback } from 'react';

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

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
