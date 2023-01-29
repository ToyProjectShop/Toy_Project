import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { loginRequestAction } from '../reducers/user';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { LogInLoading, logInError } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]);

  return (
    <Form onFinish={onSubmitForm} style={{ padding: 10 }}>
      <div>
        <label htmlFor="user-id">이메일</label>
        <br />
        <Input name="user-id" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <Button type="primary" htmlType="submit" loading={LogInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
