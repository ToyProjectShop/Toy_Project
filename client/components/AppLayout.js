import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a>Home</a>
          </Link>
        </Menu.Item>
        {me ? (
          <Menu.Item>
            <Link href="/profile">
              <a>마이페이지</a>
            </Link>
          </Menu.Item>
        ) : (
          <Menu.Item disabled={true}>
            <Link href="/profile">
              <a>마이페이지</a>
            </Link>
          </Menu.Item>
        )}
        <Menu.Item>
          <Link href="/profile">
            <a>장바구니</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={18}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

export default AppLayout;
