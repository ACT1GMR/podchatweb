import {
  MESSAGE_SEND,
  MESSAGE_EDITING,
  MESSAGE_EDIT,
  MESSAGE_NEW,
  MESSAGE_SEEN,
  MESSAGE_FORWARD, MESSAGE_SENDING_ERROR, MESSAGE_FILE_UPLOAD, MESSAGE_FILE_UPLOAD_CANCEL
} from "../constants/actionTypes";

export const messageSend = (text, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.sendMessage(text, threadId)
    });
  }
};

export const messageSendFile = (file, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.sendFileMessage(file, threadId)
    });
  }
};

export const messageCancelFile = (uniqueId, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_FILE_UPLOAD_CANCEL(),
      payload: chatSDK.cancelFileUpload(uniqueId, threadId)
    });
  }
};

export const messageEditing = (message, type) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE_EDITING,
      payload: message ? {message, type} : null
    });
  }
};

export const messageSendingError = (threadId, uniqueId) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE_SENDING_ERROR,
      payload: {threadId, uniqueId}
    });
  }
};

export const messageEdit = (newText, id) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_EDIT(),
      payload: chatSDK.editMessage(newText, id)
    });
  }
};

export const messageForward = (threadId, messageUniqueId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_FORWARD(),
      payload: chatSDK.forwardMessage(threadId, messageUniqueId)
    });
  }
};

export const messageReply = (replyText, id, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
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
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_SEEN,
      payload: chatSDK.seenMessage(message.id, message.ownerId)
    });
  }
};
