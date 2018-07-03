import {CREATE_THREAD, GET_THREAD_MESSAGE_LIST, GET_THREAD_LIST, GET_THREAD_INFO, NEW_THREAD} from "../constants/actionTypes";

export const createThread = (contactId, thread) => {
  return (dispatch, getState) => {
    if (thread) {
      return dispatch({
        type: CREATE_THREAD("CACHE"),
        payload: thread
      });
    }
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: CREATE_THREAD(),
      payload: chatSDK.createThread(contactId)
    });
  }
};

export const getThreads = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: GET_THREAD_LIST(),
      payload: chatSDK.getThreads()
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