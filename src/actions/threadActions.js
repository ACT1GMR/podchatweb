import chatSDKWrapper from "../utils/chatSDKWrapper";
import {CREATE_THREAD, GET_THREAD_MESSAGE_LIST} from "../constants/actionTypes";

export const createThread = (contactId) => {
  return dispatch => {
    return dispatch({
      type: CREATE_THREAD(),
      payload: chatSDKWrapper.createThread(contactId)
    });
  }
};

export const getThreadMessageList = (threadId) => {
  return dispatch => dispatch({
    type: GET_THREAD_MESSAGE_LIST(),
    payload: chatSDKWrapper.getThreadMessageList(threadId)
  });
};