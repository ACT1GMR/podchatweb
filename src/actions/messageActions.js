import {
  MESSAGE_SEND,
  MESSAGE_EDITING,
  MESSAGE_EDIT,
  MESSAGE_NEW,
  MESSAGE_SEEN,
  MESSAGE_FORWARD,
  MESSAGE_SENDING_ERROR,
  MESSAGE_FILE_UPLOAD_CANCEL,
  MESSAGE_DELETING, MESSAGE_CANCEL
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

export const messageSendFile = (file, threadId, caption) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.sendFileMessage(file, threadId, caption)
    });
  }
};

export const messageCancelFile = (fileUniqueId, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_FILE_UPLOAD_CANCEL(),
      payload: chatSDK.cancelFileUpload(fileUniqueId, threadId)
    });
  }
};

export const messageCancel = (uniqueId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_CANCEL(),
      payload: chatSDK.cancelMessage(uniqueId)
    });
  }
};

export const messageEditing = (message, type, threadId) => {
  return (dispatch) => {
    dispatch({
      type: MESSAGE_EDITING,
      payload: message ? {message, type, threadId} : null
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

export const messageDelete = (id, deleteForAll) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_DELETING(),
      payload: chatSDK.deleteMessage(id, deleteForAll)
    });
  }
};

export const messageForward = (threadId, messageId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_FORWARD(),
      payload: chatSDK.forwardMessage(threadId, messageId)
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
      type: MESSAGE_SEEN(),
      payload: chatSDK.seenMessage(message.id, message.ownerId, message.threadId)
    });
  }
};

export const messageGet = (threadId, messageId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return chatSDK.getMessageById(threadId, messageId);
  }
};

export const messageGetSeenList = (messageId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return chatSDK.getMessageSeenList(messageId);
  }
};