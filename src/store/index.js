import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import rootReducer from "../reducers/index";

const store = createStore(combineReducers(rootReducer), applyMiddleware(promise(), thunk));
export default store;