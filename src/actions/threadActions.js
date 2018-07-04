import {THREAD_CREATE, THREAD_GET_MESSAGE_LIST, THREAD_GET_LIST, GET_THREAD_INFO, THREAD_NEW} from "../constants/actionTypes";

export const threadCreat = (contactId, thread) => {
  return (dispatch, getState) => {
    if (thread) {
      return dispatch({
        type: THREAD_CREATE("CACHE"),
        payload: thread
      });
    }
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: THREAD_CREATE(),
      payload: chatSDK.createThread(contactId)
    });
  }
};

export const getThreads = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: THREAD_GET_LIST(),
      payload: chatSDK.getThreads()
    });
  }
};

export const getThreadMessageList = (threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: THREAD_GET_MESSAGE_LIST(),
      payload: chatSDK.getThreadMessageList(threadId)
    });
  }
};