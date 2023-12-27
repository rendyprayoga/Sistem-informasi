import { ADD_JABATAN, ADD_JABATAN_FAILED, ADD_JABATAN_SUCCESS, ADD_LEAVE, ADD_LEAVE_FAILED, ADD_LEAVE_SUCCESS, ADD_PRESENCE_IN, ADD_PRESENCE_IN_FAILED, ADD_PRESENCE_IN_SUCCESS, ADD_PRESENCE_OUT, ADD_PRESENCE_OUT_FAILED, ADD_PRESENCE_OUT_SUCCESS, ADD_USER, ADD_USER_FAILED, ADD_USER_SUCCESS, AUTH_INFO, AUTH_INFO_FAILED, AUTH_INFO_SUCCESS, DELETE_JABATAN, DELETE_JABATAN_FAILED, DELETE_JABATAN_SUCCESS, DELETE_MESSAGE, DELETE_USER, DELETE_USER_SUCCESS, EDIT_JABATAN, EDIT_JABATAN_FAILED, EDIT_JABATAN_SUCCESS, EDIT_USER, EDIT_USER_FAILED, EDIT_USER_SUCCESS, GET_COUNT_PRESENCE_USER, GET_COUNT_PRESENCE_USER_FAILED, GET_COUNT_PRESENCE_USER_SUCCESS, GET_JABATAN, GET_JABATAN_FAILED, GET_JABATAN_SUCCESS, GET_LEAVE, GET_LEAVE_FAILED, GET_LEAVE_SUCCESS, GET_LEAVE_USER, GET_LEAVE_USER_FAILED, GET_LEAVE_USER_SUCCESS, GET_PRESENCE, GET_PRESENCE_COUNT, GET_PRESENCE_COUNT_FAILED, GET_PRESENCE_COUNT_SUCCESS, GET_PRESENCE_COUNT_TODAY, GET_PRESENCE_COUNT_TODAY_FAILED, GET_PRESENCE_COUNT_TODAY_SUCCESS, GET_PRESENCE_FAILED, GET_PRESENCE_SUCCESS, GET_PRESENCE_USER, GET_PRESENCE_USER_FAILED, GET_PRESENCE_USER_SUCCESS, GET_SALARY, GET_SALARYU, GET_SALARYU_FAILED, GET_SALARYU_SUCCESS, GET_SALARY_FAILED, GET_SALARY_SUCCESS, GET_USER, GET_USERS_COUNT, GET_USERS_COUNT_FAILED, GET_USERS_COUNT_SUCCESS, GET_USER_FAILED, GET_USER_SUCCESS, LOGOUT, LOGOUT_SUCCESS, POST_EDIT_PROFILE, POST_EDIT_PROFILE_FAILED, POST_EDIT_PROFILE_SUCCESS, POST_LOGIN, POST_LOGIN_FAILED, POST_LOGIN_SUCCESS, SET_TIME, SET_TIME_SUCCESS, UPDATE_LEAVE_STATUS, UPDATE_LEAVE_STATUS_FAILED, UPDATE_LEAVE_STATUS_SUCCESS, UPDATE_PRESENCE_STATUS, UPDATE_PRESENCE_STATUS_FAILED, UPDATE_PRESENCE_STATUS_SUCCESS, UPDATE_SALARY_STATUS, UPDATE_SALARY_STATUS_FAILED, UPDATE_SALARY_STATUS_SUCCESS } from "./actionTypes"

const init_state = {
    info: {},
    isLogin: false,
    check: false,
    message: null,
    edit: null,
    delete: null,
    add: null,
    jabatan: [],
    user: [],
    presence: [],
    leave: [],
    salary: [],
    user_count: {},
    presence_count_today: {},
    presence_count: {},
    time: null
}

const Reducers = (state = init_state, action) => {
    switch (action.type) {
    case POST_LOGIN:
        state = {
            ...state
        }
        break
    case POST_LOGIN_SUCCESS:
        state = {
            ...state,
            isLogin: true,
        }
        break
    case POST_LOGIN_FAILED:
        state = {
            ...state,
            isLogin: false,
            message: action.payload
        }
        break
    case POST_EDIT_PROFILE:
        state = {
            ...state
        }
        break
    case POST_EDIT_PROFILE_SUCCESS:
        state = {
            ...state,
            edit: action.payload.data,
        }
        break
    case POST_EDIT_PROFILE_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case DELETE_MESSAGE:
        state = {
            ...state,
            message: null,
            edit: null,
            delete: null,
            add: null,
        }
        break
    case AUTH_INFO:
        state = {
            ...state
        }
        break;
    case AUTH_INFO_SUCCESS:
        state = {
            ...state,
            check: true,
            isLogin: true,
            info: action.payload,
        }
        break;
    case AUTH_INFO_FAILED:
        state = {
            ...state,
            check: false,
            isLogin: false,
            message: action.payload
        }
        break;
    case GET_JABATAN:
        state = {
            ...state,
        }
        break
    case GET_JABATAN_SUCCESS:
        state = {
            ...state,
            jabatan: action.payload,
        }
        break
    case GET_JABATAN_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case EDIT_JABATAN:
        state = {
            ...state,
        }
        break
    case EDIT_JABATAN_SUCCESS:
        state = {
            ...state,
            edit: action.payload.data,
        }
        break
    case EDIT_JABATAN_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case ADD_JABATAN:
        state = {
            ...state,
        }
        break
    case ADD_JABATAN_SUCCESS:
        state = {
            ...state,
            add: action.payload,
        }
        break
    case ADD_JABATAN_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case DELETE_JABATAN:
        state = {
            ...state,
        }
        break
    case DELETE_JABATAN_SUCCESS:
        state = {
            ...state,
            delete: action.payload
        }
        break
    case DELETE_JABATAN_FAILED:
        state = {
            ...state,
            delete: action.payload
        }
        break
    case GET_USER:
        state = {
            ...state,
        }
        break
    case GET_USER_SUCCESS:
        state = {
            ...state,
            user: action.payload,
        }
        break
    case GET_USER_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case EDIT_USER:
        state = {
            ...state,
        }
        break
    case EDIT_USER_SUCCESS:
        state = {
            ...state,
            edit: action.payload.data,
        }
        break
    case EDIT_USER_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case ADD_USER:
        state = {
            ...state,
        }
        break
    case ADD_USER_SUCCESS:
        state = {
            ...state,
            add: action.payload,
        }
        break
    case ADD_USER_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case DELETE_USER:
        state = {
            ...state,
        }
        break
    case DELETE_USER_SUCCESS:
        state = {
            ...state,
            delete: action.payload
        }
        break
    case GET_PRESENCE:
        state = {
            ...state,
        }
        break
    case GET_PRESENCE_SUCCESS:
        state = {
            ...state,
            presence: action.payload,
        }
        break
    case GET_PRESENCE_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case GET_PRESENCE_USER:
        state = {
            ...state,
        }
        break
    case GET_PRESENCE_USER_SUCCESS:
        state = {
            ...state,
            presence: action.payload,
        }
        break
    case GET_PRESENCE_USER_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case ADD_PRESENCE_IN:
        state = {
            ...state,
            add: null
        }
        break
    case ADD_PRESENCE_IN_SUCCESS:
        state = {
            ...state,
            add: action.payload,
        }
        break
    case ADD_PRESENCE_IN_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case ADD_PRESENCE_OUT:
        state = {
            ...state,
            add: null
        }
        break
    case ADD_PRESENCE_OUT_SUCCESS:
        state = {
            ...state,
            add: action.payload,
        }
        break
    case ADD_PRESENCE_OUT_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case UPDATE_PRESENCE_STATUS:
        state = {
            ...state,
        }
        break
    case UPDATE_PRESENCE_STATUS_SUCCESS:
        state = {
            ...state,
            edit: action.payload,
        }
        break
    case UPDATE_PRESENCE_STATUS_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case GET_LEAVE:
        state = {
            ...state,
        }
        break
    case GET_LEAVE_SUCCESS:
        state = {
            ...state,
            leave: action.payload,
        }
        break
    case GET_LEAVE_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case GET_LEAVE_USER:
        state = {
            ...state,
        }
        break
    case GET_LEAVE_USER_SUCCESS:
        state = {
            ...state,
            leave: action.payload,
        }
        break
    case GET_LEAVE_USER_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case ADD_LEAVE:
        state = {
            ...state,
        }
        break
    case ADD_LEAVE_SUCCESS:
        state = {
            ...state,
            add: action.payload,
        }
        break
    case ADD_LEAVE_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case UPDATE_LEAVE_STATUS:
        state = {
            ...state,
        }
        break
    case UPDATE_LEAVE_STATUS_SUCCESS:
        state = {
            ...state,
            edit: action.payload,
        }
        break
    case UPDATE_LEAVE_STATUS_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
           
    case GET_SALARY:
        state = {
            ...state,
        }
        break
    case GET_SALARY_SUCCESS:
        state = {
            ...state,
            salary: action.payload,
        }
        break
    case GET_SALARY_FAILED:
        state = {
            ...state,
        }
        break
    case GET_SALARYU:
        state = {
            ...state,
        }
        break
    case GET_SALARYU_SUCCESS:
        state = {
            ...state,
            salary: action.payload,
        }
        break
    case GET_SALARYU_FAILED:
        state = {
            ...state,
        }
        break
    case UPDATE_SALARY_STATUS:
        state = {
            ...state,
        }
        break
    case UPDATE_SALARY_STATUS_SUCCESS:
        state = {
            ...state,
            edit: action.payload,
        }
        break
    case UPDATE_SALARY_STATUS_FAILED:
        state = {
            ...state,
            message: action.payload
        }
        break
    case GET_USERS_COUNT:
        state = {
            ...state,
        }
        break
    case GET_USERS_COUNT_SUCCESS:
        state = {
            ...state,
            user_count: action.payload,
        }
        break
    case GET_USERS_COUNT_FAILED:
        state = {
            ...state,
        }
        break
    case GET_PRESENCE_COUNT:
        state = {
            ...state,
        }
        break
    case GET_PRESENCE_COUNT_SUCCESS:
        state = {
            ...state,
            presence_count: action.payload,
        }
        break
    case GET_PRESENCE_COUNT_FAILED:
        state = {
            ...state,
        }
        break
    case GET_PRESENCE_COUNT_TODAY:
        state = {
            ...state,
        }
        break
    case GET_PRESENCE_COUNT_TODAY_SUCCESS:
        state = {
            ...state,
            presence_count_today: action.payload,
        }
        break
    case GET_PRESENCE_COUNT_TODAY_FAILED:
        state = {
            ...state,
        }
        break
    case GET_COUNT_PRESENCE_USER:
        state = {
            ...state,
        }
        break
    case GET_COUNT_PRESENCE_USER_SUCCESS:
        state = {
            ...state,
            presence_count: action.payload,
        }
        break
    case GET_COUNT_PRESENCE_USER_FAILED:
        state = {
            ...state,
        }
        break
    case SET_TIME:
        state = {
            ...state,
        }
        break
    case SET_TIME_SUCCESS:
        state = {
            ...state,
            time: action.payload,
        }
        break
    case LOGOUT:
        break
    case LOGOUT_SUCCESS:
        state = { ...init_state };
        state = {
            ...state,
            isLogin: false,
        }
        break
    default:
        state = { ...state };
        break;
    }
    return state;
}

export default Reducers
