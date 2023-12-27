import { combineReducers } from "redux";
import Reducers from "./saga/reducers";

const rootReducer = combineReducers({
    store: Reducers
})

export default rootReducer;