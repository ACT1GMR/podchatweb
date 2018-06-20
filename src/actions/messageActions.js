import {SEND_MESSAGE, NEW_MESSAGE} from "../constants/actionTypes";

export const sendMessage = (text, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: SEND_MESSAGE(),
      payload: chatSDK.sendMessage(text, threadId)
    });
  }
};

export const messageReceived = (message) => {
  return dispatch => {
    dispatch({
      type: NEW_MESSAGE,
      payload: message
    });
  }
};