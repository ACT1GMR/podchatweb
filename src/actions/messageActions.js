import {MESSAGE_SEND, MESSAGE_EDITING, MESSAGE_EDIT, MESSAGE_NEW, MESSAGE_SEEN} from "../constants/actionTypes";

export const messageSend = (text, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.sendMessage(text, threadId)
    });
  }
};

export const messageEditing = (id, text, type) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE_EDITING,
      payload: id ? {text, id, type} : null
    });
  }
};

export const messageEdit = (newText, id) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: MESSAGE_EDIT(),
      payload: chatSDK.editMessage(newText, id)
    });
  }
};

export const messageReply = (replyText, id, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: MESSAGE_EDIT(),
      payload: chatSDK.replyMessage(replyText, id, threadId)
    });
  }
};

export const messageNew = (message) => {
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
