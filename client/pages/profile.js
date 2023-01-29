import React from 'react';
import AppLayout from '../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import cookie from 'cookie';

const Profile = () => {
  return <AppLayout>profile page</AppLayout>;
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
export default Profile;
