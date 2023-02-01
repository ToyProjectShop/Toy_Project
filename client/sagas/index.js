import axios from 'axios';
import { all, fork } from 'redux-saga/effects';
import { backUrl } from '../config/config';

import userSaga from './user';

axios.defaults.baseURL = backUrl;

export default function* rootSaga() {
  yield all([fork(userSaga)]);
}
