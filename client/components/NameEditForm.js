import { Button, Form, Input } from 'antd';
import { useCallback, useState } from 'react';
import { NAME_EDIT_REQUEST } from '../reducers/user';
import { useDispatch } from 'react-redux';

const NameEditForm = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const onChangeEditUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const onSubmit = useCallback(() => {
    dispatch({
      type: NAME_EDIT_REQUEST,
      data: { username },
    });
  }, [username]);
  return (
    <Form onFinish={onSubmit} style={{ width: '50%' }}>
      <div>
        <label htmlFor="user-name">이름</label>
        <br />
        <Input
          name="user-name"
          value={username}
          required
          onChange={onChangeEditUsername}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <Button type="primary" htmlType="submit">
          이름 변경
        </Button>
      </div>
    </Form>
  );
};

export default NameEditForm;
