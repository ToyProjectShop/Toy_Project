import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import { SIGN_UP_REQUEST } from '../reducers/user';
import Router from 'next/router';

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpDone, signUpError } = useSelector((state) => state.user);

  useEffect(() => {
    if (signUpDone) {
      Router.push('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
  }, []);
  const onChangeUsername = useCallback((e) => {
    setUsername(e.target.value);
  }, []);
  const onChangeCity = useCallback((e) => {
    setCity(e.target.value);
  }, []);
  const onChangeStreet = useCallback((e) => {
    setStreet(e.target.value);
  }, []);
  const onChangeZipcode = useCallback((e) => {
    setZipcode(e.target.value);
  }, []);
  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(() => {
    let check = /^[0-9]+$/;
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }

    if (!check.test(zipcode)) {
      alert('zipcode는 숫자로 작성해주세요.');
      return;
    }
    console.log(email, password, username, city, zipcode, street);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, username, city, zipcode, street },
    });
  }, [email, username, city, zipcode, street, password, passwordCheck]);
  return (
    <AppLayout>
      <Form onFinish={onSubmit} style={{ width: '50%' }}>
        <div>
          <label htmlFor="user-email">이메일</label>
          <br />
          <Input
            name="user-email"
            value={email}
            required
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-name">이름</label>
          <br />
          <Input
            name="user-name"
            value={username}
            required
            onChange={onChangeUsername}
          />
        </div>
        <div>
          <label htmlFor="user-city">City</label>
          <br />
          <Input
            name="user-city"
            value={city}
            required
            onChange={onChangeCity}
          />
        </div>
        <div>
          <label htmlFor="user-street">Street</label>
          <br />
          <Input
            name="user-street"
            value={street}
            required
            onChange={onChangeStreet}
          />
        </div>
        <div>
          <label htmlFor="user-zipcode">Zipcode</label>
          <br />
          <Input
            name="user-zipcode"
            value={zipcode}
            required
            onChange={onChangeZipcode}
          />
        </div>
        <div>
          <label htmlFor="user-password">패스워드</label>
          <br />
          <Input
            name="user-password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-passwordCheck">패스워드 체크</label>
          <br />
          <Input
            name="user-passwordCheck"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit">
            회원가입
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default Signup;
