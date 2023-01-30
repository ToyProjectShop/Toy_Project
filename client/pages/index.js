import { Button } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import cookie from 'cookie';

const Home = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>환영합니다</div>
      <div>
        <div style={{ padding: 10 }}>
          <Link href="/signup">
            <a>
              <Button>상품 구경</Button>
            </a>
          </Link>
        </div>
      </div>
    </AppLayout>
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

export default Home;
