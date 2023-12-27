import { call, put, takeEvery } from 'redux-saga/effects'
import { addJabatanFailed, addJabatanSuccess, addLeaveFailed, addLeaveSuccess, addPresenceInFailed, addPresenceInSuccess, addPresenceOutFailed, addPresenceOutSuccess, addUsersFailed, addUsersSuccess, authInfo, authInfoFailed, authInfoSuccess, deleteJabatanFailed, deleteJabatanSuccess, deleteUsersSuccess, editJabatanFailed, editJabatanSuccess, editProfilFailed, editProfilSuccess, editUsersFailed, editUsersSuccess, getJabatan, getJabatanFailed, getJabatanSuccess, getLeave, getLeaveFailed, getLeaveSuccess, getLeaveUserFailed, getLeaveUserSuccess, getPresence, getPresenceCountFailed, getPresenceCountSuccess, getPresenceCountTodayFailed, getPresenceCountTodaySuccess, getPresenceCountUserFailed, getPresenceCountUserSuccess, getPresenceFailed, getPresenceSuccess, getPresenceUser, getPresenceUserFailed, getPresenceUserSuccess, getSalary, getSalaryFailed, getSalarySuccess, getSalaryUFailed, getSalaryUSuccess, getUserCountFailed, getUserCountSuccess, getUsers, getUsersFailed, getUsersSuccess, loginFailed, loginSuccess, logoutSuccess, setTimeSuccess, updateLeaveFailed, updateLeaveSuccess, updatePresenceFailed, updatePresenceSucces, updateSalaryFailed, updateSalarySuccess } from './actions'
import { ADD_JABATAN, ADD_LEAVE, ADD_PRESENCE_IN, ADD_PRESENCE_OUT, ADD_USER, AUTH_INFO, DELETE_JABATAN, DELETE_USER, EDIT_JABATAN, EDIT_USER, GET_COUNT_PRESENCE_USER, GET_JABATAN, GET_LEAVE, GET_LEAVE_USER, GET_PRESENCE, GET_PRESENCE_COUNT, GET_PRESENCE_COUNT_TODAY, GET_PRESENCE_USER, GET_SALARY, GET_SALARYU, GET_USER, GET_USERS_COUNT, LOGOUT, POST_EDIT_PROFILE, POST_LOGIN, SET_TIME, UPDATE_LEAVE_STATUS, UPDATE_PRESENCE_STATUS, UPDATE_SALARY_STATUS } from './actionTypes'
import axios from '../../helper/apiHelper';
import { URL_ADD_LEAVE, URL_ADD_PRESENCE_IN, URL_ADD_PRESENCE_OUT, URL_COUNT_PRESENCE, URL_COUNT_PRESENCE_TODAY, URL_COUNT_PRESENCE_USER, URL_DELETE_LOGOUT, URL_DELTE_JABATAN, URL_EDIT_JABATAN, URL_GET_AUTH, URL_GET_JABATAN, URL_GET_USERS, URL_LEAVE, URL_LEAVE_UPDATE, URL_LEAVE_USER, URL_POST_JABATAN, URL_POST_LOGIN, URL_POST_PROFIL, URL_PRESENCE, URL_PRESENCE_UPDATE, URL_PRESENCE_USER, URL_SALARY, URL_SALARY_UPDATE, URL_USERS_BY_ID, URL_USER_COUNT } from '../../helper/urlHelper';
import Cookies from 'js-cookie';

// auth
export function* loginSaga({ payload: { account, navigate } }) {
    try {
        const response = yield call(axios.post, URL_POST_LOGIN, account)
        document.cookie = `token=${response.data.token}; path=/`;
        yield put(loginSuccess(response.data));
        navigate('/panel');
        yield put(authInfo())
    } catch (err) {
        yield put(loginFailed(err.response));
    }
}

export function* authInfoSaga() {
    const token = Cookies.get('token');
    if (!token) {
        yield put(authInfoFailed())
        Cookies.remove('token')
        return { isLogin: false };
    }
    try {
        const response = yield call(axios.get, URL_GET_AUTH)
        yield put(authInfoSuccess(response.data))
        return { isLogin: true, data: response.data };
    } catch (err) {
        yield put(authInfoFailed(err))
        Cookies.remove('token')
        return { isLogin: false };
    }
}

export function* logoutSaga({ payload: navigate }) {
    try {
        yield call(axios.delete, URL_DELETE_LOGOUT)
        yield put(logoutSuccess())
        Cookies.remove('token')
    } catch (err) {
        //
    }
    navigate('/')
}

// profil
export function* postProfilSaga({ payload: body }) {
    try {
        const response = yield call(axios.patch, URL_POST_PROFIL, body)
        yield put(editProfilSuccess(response))
        yield put(authInfo())
    } catch (err) {
        yield put(editProfilFailed(err.response.data))
    }
}

// jabatan
export function* getJabatanSaga() {
    try {
        const response = yield call(axios.get, URL_GET_JABATAN)
        yield put(getJabatanSuccess(response.data))
    } catch (err) {
        yield put(getJabatanFailed(err.response.data))
    }
}

export function* addJabatanSaga({ payload: {body, navigate} }) {
    try {
        const response = yield call(axios.post, URL_POST_JABATAN, body)
        yield put(addJabatanSuccess(response.data))
        navigate('/panel/jabatan')
        yield put(getJabatan())
    } catch (err) {
        yield put(addJabatanFailed(err.response))
    }
}

export function* editJabatanSaga({ payload: {id, body }}) {
    try {
        const response = yield call(axios.patch, URL_EDIT_JABATAN.replace(':id', id), body)
        yield put(editJabatanSuccess(response))
        yield put(getJabatan())
    } catch (err) {
        yield put(editJabatanFailed(err.response.data))
    }
}

export function* deleteJabatanSaga({ payload: id}) {
    try {
        const response = yield call(axios.delete, URL_DELTE_JABATAN.replace(':id', id))
        yield put(deleteJabatanSuccess(response.data))
        yield put(getJabatan())
    } catch (err) {
        yield put(deleteJabatanFailed(err.response.data))
    }
}

// user
export function* getUserSaga() {
    try {
        const response = yield call(axios.get, URL_GET_USERS)
        yield put(getUsersSuccess(response.data))
    } catch (err) {
        yield put(getUsersFailed(err.response.data))
    }
}

export function* addUserSaga({ payload: {body, navigate} }) {
    try {
        const response = yield call(axios.post, URL_GET_USERS, body)
        yield put(addUsersSuccess(response.data))
        navigate('/panel/users')
        yield put(getUsers())
    } catch (err) {
        yield put(addUsersFailed(err.response))
    }
}

export function* editUserSaga({ payload: {id, body }}) {
    try {
        const response = yield call(axios.patch, URL_USERS_BY_ID.replace(':id', id), body)
        yield put(editUsersSuccess(response))
        yield put(getUsers())
    } catch (err) {
        yield put(editUsersFailed(err.response.data))
    }
}

export function* deleteUserSaga({ payload: id}) {
    try {
        const response = yield call(axios.delete, URL_USERS_BY_ID.replace(':id', id))
        yield put(deleteUsersSuccess(response.data))
        yield put(getUsers())
    } catch (err) {
        // 
    }
}

export function* getPresenceSaga() {
    try {
        const response = yield call(axios.get, URL_PRESENCE)
        yield put(getPresenceSuccess(response.data))
    }
    catch (err) {
        yield put(getPresenceFailed(err.response.data))
    }
}

export function* getPresenceUserSaga() {
    try {
        const response = yield call(axios.get, URL_PRESENCE_USER)
        yield put(getPresenceUserSuccess(response.data))
    }
    catch (err) {
        yield put(getPresenceUserFailed(err.response.data))
    }
}

export function* postPresenceInSaga({payload: data}) {
    try {
        const response = yield call(axios.post, URL_ADD_PRESENCE_IN, data)
        yield put(addPresenceInSuccess(response.data))
        yield put(getPresenceUser())
    } catch (err) {
        yield put(addPresenceInFailed(err.response.data))
    }
}
export function* postPresenceOutSaga({payload: data}) {
    try {
        const response = yield call(axios.post, URL_ADD_PRESENCE_OUT, data)
        yield put(addPresenceOutSuccess(response.data))
        yield put(getPresenceUser())
    } catch (err) {
        yield put(addPresenceOutFailed(err.response.data))
    }
}

export function* updatePreseceSaga({payload: {id, body}}) {
    try {
        const response = yield call(axios.patch, URL_PRESENCE_UPDATE.replace(':id', id), body)
        yield put(updatePresenceSucces(response))
        yield put(getPresence())
    } catch (err) {
        yield put(updatePresenceFailed(err.response.data))
    }
}

export function* getLeaveSaga() {
    try {
        const response = yield call(axios.get, URL_LEAVE)
        yield put(getLeaveSuccess(response.data))
    }
    catch (err) {
        yield put(getLeaveFailed(err.response.data))
    }
}
export function* addLeaveSaga({payload: {body, navigate}}) {
    try {
        const response = yield call(axios.post, URL_ADD_LEAVE, body)
        yield put(addLeaveSuccess(response.data))
        navigate('/panel/leaves')
    }
    catch (err) {
        yield put(addLeaveFailed(err.response.data))
    }
}

export function* getLeaveUserSaga() {
    try {
        const response = yield call(axios.get, URL_LEAVE_USER)
        yield put(getLeaveUserSuccess(response.data))
    }
    catch (err) {
        yield put(getLeaveUserFailed(err.response.data))
    }
}

export function* updateLeaveSaga({payload: {id, body}}) {
    try {
        const response = yield call(axios.patch, URL_LEAVE_UPDATE.replace(':id', id), body)
        yield put(updateLeaveSuccess(response))
        yield put(getLeave())
    } catch (err) {
        yield put(updateLeaveFailed(err.response.data))
    }
}

export function* getSalarySaga() {
    try {
        const response = yield call(axios.get, URL_SALARY)
        yield put(getSalarySuccess(response.data))
    } catch (err) {
        yield put(getSalaryFailed(err.response.data))
    }
}
export function* getSalaryUSaga() {
    try {
        const response = yield call(axios.get, URL_SALARY)
        yield put(getSalaryUSuccess(response.data))
    } catch (err) {
        yield put(getSalaryUFailed(err.response.data))
    }
}

export function* updateSalarySaga({ payload: { id, body } }) {
    try {
        const response = yield call(axios.patch, URL_SALARY_UPDATE.replace(":id", id), body)
        yield put(updateSalarySuccess(response))
        yield put(getSalary())
    }
    catch (err) {
        yield put(updateSalaryFailed(err.response.data))
    }
}

export function* getUserCountSaga() {
    try {
        const response = yield call(axios.get, URL_USER_COUNT)
        yield put(getUserCountSuccess(response.data))
    } catch (err) {
        yield put(getUserCountFailed(err.response.data))
    }
}
export function* getPresenceCountTodaySaga() {
    try {
        const response = yield call(axios.get, URL_COUNT_PRESENCE_TODAY)
        yield put(getPresenceCountTodaySuccess(response.data))
    } catch (err) {
        yield put(getPresenceCountTodayFailed(err.response.data))
    }
}
export function* getPresenceCountSaga() {
    try {
        const response = yield call(axios.get, URL_COUNT_PRESENCE)
        yield put(getPresenceCountSuccess(response.data))
    } catch (err) {
        yield put(getPresenceCountFailed(err.response.data))
    }
}
export function* getPresenceCountUserSaga() {
    try {
        const response = yield call(axios.get, URL_COUNT_PRESENCE_USER)
        yield put(getPresenceCountUserSuccess(response.data))
    } catch (err) {
        yield put(getPresenceCountUserFailed(err.response.data))
    }
}

export function* setTimeSaga() {
    try {
        const now = new Date();
        yield put(setTimeSuccess(now.toLocaleTimeString()));
    } catch (err) {
        //
    }
}

export function* Sagas() {
    yield takeEvery(POST_LOGIN, loginSaga)
    yield takeEvery(AUTH_INFO, authInfoSaga)
    yield takeEvery(LOGOUT, logoutSaga)
    yield takeEvery(POST_EDIT_PROFILE, postProfilSaga)
    yield takeEvery(ADD_JABATAN, addJabatanSaga)
    yield takeEvery(GET_JABATAN, getJabatanSaga)
    yield takeEvery(EDIT_JABATAN, editJabatanSaga)
    yield takeEvery(DELETE_JABATAN, deleteJabatanSaga)
    yield takeEvery(ADD_USER, addUserSaga)
    yield takeEvery(GET_USER, getUserSaga)
    yield takeEvery(EDIT_USER, editUserSaga)
    yield takeEvery(DELETE_USER, deleteUserSaga)
    yield takeEvery(GET_PRESENCE, getPresenceSaga)
    yield takeEvery(GET_PRESENCE_USER, getPresenceUserSaga)
    yield takeEvery(UPDATE_PRESENCE_STATUS, updatePreseceSaga)
    yield takeEvery(ADD_LEAVE, addLeaveSaga)
    yield takeEvery(GET_LEAVE, getLeaveSaga)
    yield takeEvery(GET_LEAVE_USER, getLeaveUserSaga)
    yield takeEvery(UPDATE_LEAVE_STATUS, updateLeaveSaga)
    yield takeEvery(GET_SALARY, getSalarySaga)
    yield takeEvery(GET_SALARYU, getSalaryUSaga)
    yield takeEvery(UPDATE_SALARY_STATUS, updateSalarySaga)
    yield takeEvery(GET_USERS_COUNT, getUserCountSaga)
    yield takeEvery(GET_PRESENCE_COUNT, getPresenceCountSaga)
    yield takeEvery(GET_PRESENCE_COUNT_TODAY, getPresenceCountTodaySaga)
    yield takeEvery(ADD_PRESENCE_IN, postPresenceInSaga)
    yield takeEvery(ADD_PRESENCE_OUT, postPresenceOutSaga)
    yield takeEvery(SET_TIME, setTimeSaga)
    yield takeEvery(GET_COUNT_PRESENCE_USER, getPresenceCountUserSaga)
}
export default Sagas