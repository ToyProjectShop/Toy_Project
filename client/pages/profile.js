import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';
import { END } from 'redux-saga';
import cookie from 'cookie';
import { useSelector } from 'react-redux';
import NameEditForm from '../components/NameEditForm';

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <div>
        <div>
          <p>이메일 : {me?.email}</p>
        </div>
        <div>
          <p>이름 : {me?.username}</p>
        </div>
        <NameEditForm />
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
export default Profile;
