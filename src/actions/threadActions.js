import {CREATE_THREAD, GET_THREAD_MESSAGE_LIST} from "../constants/actionTypes";

export const createThread = (contactId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: CREATE_THREAD(),
      payload: chatSDK.createThread(contactId)
    });
  }
};

export const getThreadMessageList = (threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: GET_THREAD_MESSAGE_LIST(),
      payload: chatSDK.getThreadMessageList(threadId)
    });
  }
};