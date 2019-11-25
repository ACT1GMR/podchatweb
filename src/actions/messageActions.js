import {
  MESSAGE_SEND,
  MESSAGE_EDITING,
  MESSAGE_EDIT,
  MESSAGE_NEW,
  MESSAGE_SEEN,
  MESSAGE_FORWARD,
  MESSAGE_SENDING_ERROR,
  MESSAGE_FILE_UPLOAD_CANCEL,
  MESSAGE_DELETING, MESSAGE_CANCEL, THREAD_CREATE
} from "../constants/actionTypes";
import {threadCreateWithExistThread, threadCreateWithUser, threadCreateWithUserWithMessage} from "./threadActions";
import {getNow} from "../utils/helpers";
import {stateGeneratorState} from "../utils/storeHelper";

const {SUCCESS} = stateGeneratorState;

export const messageSend = (text, threadId, other) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.sendMessage(text, threadId, other)
    });
  }
};

export const messageSendOnTheFly = text => {
  return (dispatch, getState) => {
    const state = getState();
    const thread = state.thread.thread;
    const chatSDK = state.chatInstance.chatSDK;
    const messageMock = {
      threadId: thread.id,
      time: getNow() * Math.pow(10, 6),
      uniqueId: `${Math.random()}`,
      participant: state.user.user,
      message: text
    };
    if (thread.pendingMessage.push(messageMock) <= 1) {
      chatSDK.createThread(thread.partner, thread.participant.contactId ? null : "TO_BE_USER_ID").then(thread => {
        dispatch({
          type: THREAD_CREATE("CACHE"),
          payload: thread
        });
        const currentThread = state.thread.thread;
        const {pendingMessage} = currentThread;
        if (pendingMessage.length) {
          for (const message of pendingMessage) {
            dispatch(messageSend(message.message, thread.id, {uniqueId: `${message.uniqueId}`}));
          }
        }
      });
    }
    dispatch({
      type: MESSAGE_SEND(SUCCESS),
      payload: messageMock
    });
    dispatch(threadCreateWithExistThread(thread));
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

export const messageEdit = (newText, id, messageEditing) => {
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

export const messageReply = (replyText, id, threadId, repliedMessage) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: MESSAGE_SEND(),
      payload: chatSDK.replyMessage(replyText, id, threadId, repliedMessage)
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

export const messageGetSeenList = (messageId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return chatSDK.getMessageSeenList(messageId);
  }
};