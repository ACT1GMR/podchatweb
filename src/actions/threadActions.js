import {
  THREAD_CREATE,
  THREAD_GET_MESSAGE_LIST,
  THREAD_GET_LIST,
  THREAD_GET_MESSAGE_LIST_PARTIAL,
  THREAD_MODAL_LIST_SHOWING
} from "../constants/actionTypes";

export const threadCreate = (contactId, thread) => {
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

export const threadGetList = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: THREAD_GET_LIST(),
      payload: chatSDK.getThreads()
    });
  }
};

export const threadMessageGetList = (threadId, offset) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: offset ? THREAD_GET_MESSAGE_LIST_PARTIAL() : THREAD_GET_MESSAGE_LIST(),
      payload: chatSDK.getThreadMessageList(threadId, offset)
    });
  }
};


export const threadModalListShowing = (isShowing, messageId, messageText) => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_LIST_SHOWING,
      payload: {isShowing, messageId, messageText}
    });
  }
};
