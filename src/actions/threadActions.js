import {
  THREAD_CREATE,
  THREAD_GET_MESSAGE_LIST,
  THREAD_GET_LIST,
  THREAD_GET_MESSAGE_LIST_PARTIAL,
  THREAD_MODAL_LIST_SHOWING,
  THREAD_PARTICIPANT_GET_LIST,
  THREAD_PARTICIPANT_ADD,
  THREAD_MODAL_THREAD_INFO_SHOWING,
  THREAD_PARTICIPANT_REMOVE,
  THREAD_MODAL_MEDIA_SHOWING,
  THREAD_FILES_TO_UPLOAD, CONTACT_LIST_SHOWING, THREAD_SHOWING
} from "../constants/actionTypes";

export const threadCreate = (contactId, thread, threadName) => {
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
      payload: chatSDK.createThread(contactId, threadName)
    });
  }
};

export const threadGetList = threadIds => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: THREAD_GET_LIST(),
      payload: chatSDK.getThreads(threadIds)
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

export const threadParticipantList = (threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: THREAD_PARTICIPANT_GET_LIST(),
      payload: chatSDK.getThreadParticipantList(threadId)
    });
  }
};


export const threadModalListShowing = (isShowing, message) => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_LIST_SHOWING,
      payload: {isShowing, message}
    });
  }
};


export const threadModalMediaShowing = (isShowing, object = {}) => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_MEDIA_SHOWING,
      payload: {isShowing, ...object}
    });
  }
};


export const threadModalCreateGroupShowing = (isShowing) => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_CREATE_GROUP_SHOWING,
      payload: {isShowing}
    });
  }
};

export const threadModalThreadInfoShowing = (isShowing) => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_THREAD_INFO_SHOWING,
      payload: isShowing
    });
  }
};


export const threadAddParticipant = (threadId, contactIds) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: THREAD_PARTICIPANT_ADD(),
      payload: chatSDK.addParticipants(threadId, contactIds)
    });
  }
};


export const threadRemoveParticipant = (threadId, participants) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: THREAD_PARTICIPANT_REMOVE(),
      payload: chatSDK.removeParticipants(threadId, participants)
    });
  }
};

export const threadInfo = (threadId, contactIds) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: THREAD_PARTICIPANT_ADD(),
      payload: chatSDK.addParticipants(threadId, contactIds)
    });
  }
};

export const threadFilesToUpload = (files) => {
  return (dispatch) => {
    return dispatch({
      type: THREAD_FILES_TO_UPLOAD,
      payload: files
    });
  }
};


export const threadShowing = (isShowing) => {
  return dispatch => {
    return dispatch({
      type: THREAD_SHOWING,
      payload: isShowing
    });
  }
};
