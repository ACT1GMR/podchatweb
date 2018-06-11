// src/actions/SendMessage.js
import {GET_THREAD_MESSAGE_LIST, GET_THREAD_MESSAGE_LIST_FAILURE, GET_THREAD_MESSAGE_LIST_SUCCESS} from "../constants/ActionTypes";
import chatSDKWrapper from "../utils/ChatSDKWrapper";

export const getThreadMessageListService = userId => {
  dispatch(getThreadMessageList());
  return dispatch => {
    chatSDKWrapper.getThreadMessageList(userId).then((response, error) => {
      if(response) {
        return dispatch(getThreadMessageListSuccess(response));
      }
      dispatch(getThreadMessageListFailure(error));
    });
  }
};

export const getThreadMessageList = () => {type: GET_THREAD_MESSAGE_LIST};
export const getThreadMessageListFailure = error => {type: GET_THREAD_MESSAGE_LIST_FAILURE, error};
export const getThreadMessageListSuccess = response => {type: GET_THREAD_MESSAGE_LIST_SUCCESS, response};

