import { all, fork } from 'redux-saga/effects';
import Sagas from './saga/sagas';

export default function* rootSaga() {
    yield all([
        fork(Sagas)
    ]);
}