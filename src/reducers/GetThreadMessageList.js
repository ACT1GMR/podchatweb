import {GET_THREAD_MESSAGE_LIST, GET_THREAD_MESSAGE_LIST_FAILURE, GET_THREAD_MESSAGE_LIST_SUCCESS} from "../constants/ActionTypes";

const initialState = {
  messages: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_THREAD_MESSAGE_LIST:
      return {status: GET_THREAD_MESSAGE_LIST};
    case GET_THREAD_MESSAGE_LIST_FAILURE:
      return {status: GET_THREAD_MESSAGE_LIST_FAILURE, error: action.error};
    case GET_THREAD_MESSAGE_LIST_SUCCESS:
      return {status: GET_THREAD_MESSAGE_LIST_SUCCESS, messages: action.response};
    default:
      return state;
  }
};
