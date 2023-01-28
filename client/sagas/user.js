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
} from '../reducers/user';

function signUpAPI(data) {
  return axios.post('http://localhost:4000/api/auth/signup', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      data: err.response.data.message,
    });
  }
}

function logInAPI(data) {
  return axios.post('/api/auth/login', data);
}

function* logIn(action) {
  try {
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      data: err.response.data.message,
    });
  }
}

function* logOut(action) {
  try {
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: action.data,
    });
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

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchSignUp)]);
}
