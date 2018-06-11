import {CREATE_THREAD_SUCCESS, CREATE_THREAD_FAILURE, CREATE_THREAD} from "../constants/ActionTypes";

const initialState = {
  messageSent: {}
};
export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_THREAD:
      return {status: CREATE_THREAD};
    case CREATE_THREAD_FAILURE:
      return {status: CREATE_THREAD_FAILURE, error: action.error};
    case CREATE_THREAD_SUCCESS:
      return {status: CREATE_THREAD_SUCCESS, messageSent: action.response};
    default:
      return state;
  }
};
