import {MESSAGE_SEND, MESSAGE_NEW, MESSAGE_SEEN} from "../constants/actionTypes";

export const sendMessage = (text, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.sendMessage(text, threadId)
    });
  }
};

export const messageReceived = (message) => {
  return dispatch => {
    dispatch({
      type: MESSAGE_NEW,
      payload: message
    });
  }
};

export const messageSeen = (message) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: MESSAGE_SEEN,
      payload: chatSDK.seenMessage(message.id, message.ownerId)
    });
  }
};