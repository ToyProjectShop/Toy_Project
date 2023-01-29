import {
  all,
  call,
  delay,
  fork,
  put,
  take,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import cookie from 'react-cookies';

import {
  LOG_IN_SUCCESS,
  LOG_IN_REQUEST,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
} from '../reducers/user';

function signUpAPI(data) {
  return axios.post('/auth/signup', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
    alert('회원가입에 성공하셨습니다.');
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      data: err.response.data.message,
    });
  }
}

function loadMyInfoAPI(data) {
  return axios.get('/auth', {
    headers: {
      Authorization: `Bearer ${data}`,
    },
  });
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    console.log(result);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data.data,
    });
    const accessToken = result.data.data.jwtAccessToken;

    cookie.save('accessToken', accessToken);
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      data: err.response.data.message,
    });
  }
}

function logInAPI(data) {
  return axios.post('/auth/login', data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });

    axios.defaults.headers.common['x-access-token'] =
      result.data.data.jwtAccessToken;
    const accessToken = result.data.data.jwtAccessToken;
    const refreshToken = result.data.data.jwtRefreshToken;

    cookie.save('accessToken', accessToken);
    cookie.save('refreshToken', refreshToken);
    console.log(cookie);
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      data: err.response.data.message,
    });
  }
}

function* logOut(action) {
  try {
    yield put({
      type: LOG_OUT_SUCCESS,
      data: action.data,
    });
    cookie.remove('accessToken');
    cookie.remove('refreshToken');
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      data: err.response.data.message,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchLoadMyInfo),
  ]);
}
