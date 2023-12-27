import { ADD_JABATAN, ADD_JABATAN_FAILED, ADD_JABATAN_SUCCESS, ADD_LEAVE, ADD_LEAVE_FAILED, ADD_LEAVE_SUCCESS, ADD_PRESENCE_IN, ADD_PRESENCE_IN_FAILED, ADD_PRESENCE_IN_SUCCESS, ADD_PRESENCE_OUT, ADD_PRESENCE_OUT_FAILED, ADD_PRESENCE_OUT_SUCCESS, ADD_USER, ADD_USER_FAILED, ADD_USER_SUCCESS, AUTH_INFO, AUTH_INFO_FAILED, AUTH_INFO_SUCCESS, DELETE_JABATAN, DELETE_JABATAN_SUCCESS, DELETE_MESSAGE, DELETE_USER, DELETE_USER_SUCCESS, EDIT_JABATAN, EDIT_JABATAN_FAILED, EDIT_JABATAN_SUCCESS, EDIT_USER, EDIT_USER_FAILED, EDIT_USER_SUCCESS, GET_COUNT_PRESENCE_USER, GET_COUNT_PRESENCE_USER_FAILED, GET_COUNT_PRESENCE_USER_SUCCESS, GET_JABATAN, GET_JABATAN_FAILED, GET_JABATAN_SUCCESS, GET_LEAVE, GET_LEAVE_FAILED, GET_LEAVE_SUCCESS, GET_LEAVE_USER, GET_LEAVE_USER_FAILED, GET_LEAVE_USER_SUCCESS, GET_PRESENCE, GET_PRESENCE_COUNT, GET_PRESENCE_COUNT_FAILED, GET_PRESENCE_COUNT_SUCCESS, GET_PRESENCE_COUNT_TODAY, GET_PRESENCE_COUNT_TODAY_FAILED, GET_PRESENCE_COUNT_TODAY_SUCCESS, GET_PRESENCE_FAILED, GET_PRESENCE_SUCCESS, GET_PRESENCE_USER, GET_PRESENCE_USER_FAILED, GET_PRESENCE_USER_SUCCESS, GET_SALARY, GET_SALARYU, GET_SALARYU_FAILED, GET_SALARYU_SUCCESS, GET_SALARY_FAILED, GET_SALARY_SUCCESS, GET_USER, GET_USERS_COUNT, GET_USERS_COUNT_FAILED, GET_USERS_COUNT_SUCCESS, GET_USER_FAILED, GET_USER_SUCCESS, LOGOUT, LOGOUT_SUCCESS, POST_EDIT_PROFILE, POST_EDIT_PROFILE_FAILED, POST_EDIT_PROFILE_SUCCESS, POST_LOGIN, POST_LOGIN_FAILED, POST_LOGIN_SUCCESS, SET_TIME, SET_TIME_SUCCESS, UPDATE_LEAVE_STATUS, UPDATE_LEAVE_STATUS_FAILED, UPDATE_LEAVE_STATUS_SUCCESS, UPDATE_PRESENCE_STATUS, UPDATE_PRESENCE_STATUS_FAILED, UPDATE_PRESENCE_STATUS_SUCCESS, UPDATE_SALARY_STATUS, UPDATE_SALARY_STATUS_FAILED, UPDATE_SALARY_STATUS_SUCCESS } from "./actionTypes";

// auth
export const login = (account, navigate) => ({
    type: POST_LOGIN,
    payload: { account, navigate }
})

export const loginSuccess = (respons) => ({
    type: POST_LOGIN_SUCCESS,
    payload: respons
})

export const loginFailed = (message) => ({
    type: POST_LOGIN_FAILED,
    payload: message
})


export const authInfo = () => ({
    type: AUTH_INFO,
    payload: null
})

export const authInfoSuccess = (respons) => ({
    type: AUTH_INFO_SUCCESS,
    payload: respons
})

export const authInfoFailed = (message) => ({
    type: AUTH_INFO_FAILED,
    payload: message
})


export const logout = (navigate) => ({
    type: LOGOUT,
    payload: navigate,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
    payload: {},
});

// user me
export const editProfil = (body) => ({
    type: POST_EDIT_PROFILE,
    payload: body
})
export const editProfilSuccess = (response) => ({
    type: POST_EDIT_PROFILE_SUCCESS,
    payload: response
})
export const editProfilFailed = (message) => ({
    type: POST_EDIT_PROFILE_FAILED,
    payload: message
})

// Jabatan
export const getJabatan = () => ({
    type: GET_JABATAN,
    payload: null
})
export const getJabatanSuccess = (respons) => ({
    type: GET_JABATAN_SUCCESS,
    payload: respons
})
export const getJabatanFailed = (message) => ({
    type: GET_JABATAN_FAILED,
    payload: message
})

export const editJabatan = (id, body) => ({
    type: EDIT_JABATAN,
    payload: {id, body}
})
export const editJabatanSuccess = (respons) => ({
    type: EDIT_JABATAN_SUCCESS,
    payload: respons
})
export const editJabatanFailed = (message) => ({
    type: EDIT_JABATAN_FAILED,
    payload: message
})

export const addJabatan = (body, navigate) => ({
    type: ADD_JABATAN,
    payload: {body, navigate}
})
export const addJabatanSuccess = (respons) => ({
    type: ADD_JABATAN_SUCCESS,
    payload: respons
})
export const addJabatanFailed = (message) => ({
    type: ADD_JABATAN_FAILED,
    payload: message
})

export const deleteJabatan = (id) => ({
    type: DELETE_JABATAN,
    payload: id
})
export const deleteJabatanSuccess = (respons) => ({
    type: DELETE_JABATAN_SUCCESS,
    payload: respons
})
export const deleteJabatanFailed = (message) => ({
    type: DELETE_JABATAN_SUCCESS,
    payload: message
})

// users
export const getUsers = () => ({
    type: GET_USER,
    payload: null
})
export const getUsersSuccess = (respons) => ({
    type: GET_USER_SUCCESS,
    payload: respons
})
export const getUsersFailed = (message) => ({
    type: GET_USER_FAILED,
    payload: message
})

export const editUsers = (id, body) => ({
    type: EDIT_USER,
    payload: {id, body}
})
export const editUsersSuccess = (respons) => ({
    type: EDIT_USER_SUCCESS,
    payload: respons
})
export const editUsersFailed = (message) => ({
    type: EDIT_USER_FAILED,
    payload: message
})

export const addUsers = (body, navigate) => ({
    type: ADD_USER,
    payload: {body, navigate}
})
export const addUsersSuccess = (respons) => ({
    type: ADD_USER_SUCCESS,
    payload: respons
})
export const addUsersFailed = (message) => ({
    type: ADD_USER_FAILED,
    payload: message
})

export const deleteUsers = (id) => ({
    type: DELETE_USER,
    payload: id
})
export const deleteUsersSuccess = (respons) => ({
    type: DELETE_USER_SUCCESS,
    payload: respons
})

// Presence
export const getPresence = () => ({
    type: GET_PRESENCE,
    payload: null
})
export const getPresenceSuccess = (response) => ({
    type: GET_PRESENCE_SUCCESS,
    payload: response
})
export const getPresenceFailed = (message) => ({
    type: GET_PRESENCE_FAILED,
    payload: message
})
export const getPresenceUser = () => ({
    type: GET_PRESENCE_USER,
    payload: null
})
export const getPresenceUserSuccess = (response) => ({
    type: GET_PRESENCE_USER_SUCCESS,
    payload: response
})
export const getPresenceUserFailed = (message) => ({
    type: GET_PRESENCE_USER_FAILED,
    payload: message
})
export const addPresenceIn = (data) => ({
    type: ADD_PRESENCE_IN,
    payload: {data}
})
export const addPresenceInSuccess = (response) => ({
    type: ADD_PRESENCE_IN_SUCCESS,
    payload: response
})
export const addPresenceInFailed = (message) => ({
    type: ADD_PRESENCE_IN_FAILED,
    payload: message
})
export const addPresenceOut = (data) => ({
    type: ADD_PRESENCE_OUT,
    payload: {data}
})
export const addPresenceOutSuccess = (response) => ({
    type: ADD_PRESENCE_OUT_SUCCESS,
    payload: response
})
export const addPresenceOutFailed = (message) => ({
    type: ADD_PRESENCE_OUT_FAILED,
    payload: message
})
export const updatePresence = (id, body) => ({
    type: UPDATE_PRESENCE_STATUS,
    payload: {id, body}
})
export const updatePresenceSucces = (response) => ({
    type: UPDATE_PRESENCE_STATUS_SUCCESS,
    payload: response
})
export const updatePresenceFailed = (message) => ({
    type: UPDATE_PRESENCE_STATUS_FAILED,
    payload: message
})


// leave
export const getLeave = () => ({
    type: GET_LEAVE,
    payload: null
})
export const getLeaveSuccess = (response) => ({
    type: GET_LEAVE_SUCCESS,
    payload: response
})
export const getLeaveFailed = (message) => ({
    type: GET_LEAVE_FAILED,
    payload: message
})
export const getLeaveUser = () => ({
    type: GET_LEAVE_USER,
    payload: null
})
export const getLeaveUserSuccess = (response) => ({
    type: GET_LEAVE_USER_SUCCESS,
    payload: response
})
export const getLeaveUserFailed = (message) => ({
    type: GET_LEAVE_USER_FAILED,
    payload: message
})
export const addLeave = (body, navigate) => ({
    type: ADD_LEAVE,
    payload: {body, navigate}
})
export const addLeaveSuccess = (response) => ({
    type: ADD_LEAVE_SUCCESS,
    payload: response
})
export const addLeaveFailed = (message) => ({
    type: ADD_LEAVE_FAILED,
    payload: message
})
export const updateLeave = (id, body) => ({
    type: UPDATE_LEAVE_STATUS,
    payload: {id, body}
})
export const updateLeaveSuccess = (response) => ({
    type: UPDATE_LEAVE_STATUS_SUCCESS,
    payload: response
})
export const updateLeaveFailed = (message) => ({
    type: UPDATE_LEAVE_STATUS_FAILED,
    payload: message
})

// Salary
export const getSalary = () => ({
    type: GET_SALARY,
    payload: null
})
export const getSalarySuccess = (response) => ({
    type: GET_SALARY_SUCCESS,
    payload: response
})
export const getSalaryFailed = (message) => ({
    type: GET_SALARY_FAILED,
    payload: message
})
export const getSalaryU = () => ({
    type: GET_SALARYU,
    payload: null
})
export const getSalaryUSuccess = (response) => ({
    type: GET_SALARYU_SUCCESS,
    payload: response
})
export const getSalaryUFailed = (message) => ({
    type: GET_SALARYU_FAILED,
    payload: message
})
export const updateSalary = (id, body) => ({
    type: UPDATE_SALARY_STATUS,
    payload: {id, body}
})
export const updateSalarySuccess = (response) => ({
    type: UPDATE_SALARY_STATUS_SUCCESS,
    payload: response
})
export const updateSalaryFailed = (message) => ({
    type: UPDATE_SALARY_STATUS_FAILED,
    payload: message
})

// Counter
export const getUserCount = () => ({
    type: GET_USERS_COUNT,
    payload: null
}) 
export const getUserCountSuccess = (response) => ({
    type: GET_USERS_COUNT_SUCCESS,
    payload: response
}) 
export const getUserCountFailed = (message) => ({
    type: GET_USERS_COUNT_FAILED,
    payload: message
}) 
export const getPresenceCount = () => ({
    type: GET_PRESENCE_COUNT,
    payload: null
}) 
export const getPresenceCountSuccess = (response) => ({
    type: GET_PRESENCE_COUNT_SUCCESS,
    payload: response
}) 
export const getPresenceCountFailed = (message) => ({
    type: GET_PRESENCE_COUNT_FAILED,
    payload: message
}) 
export const getPresenceCountToday = () => ({
    type: GET_PRESENCE_COUNT_TODAY,
    payload: null
}) 
export const getPresenceCountTodaySuccess = (response) => ({
    type: GET_PRESENCE_COUNT_TODAY_SUCCESS,
    payload: response
}) 
export const getPresenceCountTodayFailed = (message) => ({
    type: GET_PRESENCE_COUNT_TODAY_FAILED,
    payload: message
}) 

export const getPresenceCountUser = () => ({
    type: GET_COUNT_PRESENCE_USER,
    payload: null
})
export const getPresenceCountUserSuccess = (response) => ({
    type: GET_COUNT_PRESENCE_USER_SUCCESS,
    payload: response
})
export const getPresenceCountUserFailed = (message) => ({
    type: GET_COUNT_PRESENCE_USER_FAILED,
    payload: message
})

// delete notify
export const deleteMessage = () => ({
    type: DELETE_MESSAGE,
    payload: null
})

export const setTimereq = () => ({
    type: SET_TIME,
    payload: null
})
export const setTimeSuccess = (time) => ({
    type: SET_TIME_SUCCESS,
    payload: time
})
