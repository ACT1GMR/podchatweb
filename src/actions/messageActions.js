import {SEND_MESSAGE} from "../constants/actionTypes";

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

export const messageReceived = (text, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: SEND_MESSAGE(),
      payload: chatSDK.sendMessage(text, threadId)
    });
  }
};


export const threadCreated = (text, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: SEND_MESSAGE(),
      payload: chatSDK.sendMessage(text, threadId)
    });
  }
};