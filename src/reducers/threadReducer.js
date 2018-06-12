import {CREATE_THREAD, GET_THREAD_MESSAGE_LIST} from "../constants/actionTypes";

export const createThreadReducer = (state = {
  thread: null,
  isFetching: true,
  isFetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CREATE_THREAD():
      return {...state, isFetching: true};
    case CREATE_THREAD("FETCHED"):
      return {...state, isFetching: false, isFetched: true, contact: action.payload};
    case CREATE_THREAD("REJECTED"):
      return {...state, isFetching: false, isFetched: true, error: action.payload};
    default:
      return state;
  }
};

export const threadMessageListReducer = (state = {
  messages: [],
  isFetching: true,
  isFetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case GET_THREAD_MESSAGE_LIST():
      return {...state, isFetching: true};
    case GET_THREAD_MESSAGE_LIST("FETCHED"):
      return {...state, isFetching: false, isFetched: true, contacts: action.payload};
    case GET_THREAD_MESSAGE_LIST("REJECTED"):
      return {...state, isFetching: false, isFetched: true, error: action.payload};
    default:
      return state;
  }
};