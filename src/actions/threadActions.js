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
  THREAD_FILES_TO_UPLOAD,
  CONTACT_LIST_SHOWING,
  THREAD_SHOWING,
  THREAD_MODAL_IMAGE_CAPTION_SHOWING,
  THREAD_IMAGES_TO_CAPTION,
  THREAD_IMAGE_TO_UPLOAD,
  THREAD_META_UPDATE,
  THREAD_NAME_UPDATE,
  THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID, THREAD_LEFT_ASIDE_SHOWING, THREAD_SEARCH_MESSAGE, THREAD_GO_TO_MESSAGE
} from "../constants/actionTypes";

export const threadCreate = (contactId, thread, threadName) => {
  return (dispatch, getState) => {
    dispatch(threadShowing(true));
    if (thread) {
      return dispatch({
        type: THREAD_CREATE("CACHE"),
        payload: thread
      });
    }
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return dispatch({
      type: THREAD_CREATE(),
      payload: chatSDK.createThread(contactId, threadName)
    });
  }
};

export const threadGetList = threadIds => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_GET_LIST(),
      payload: chatSDK.getThreads(threadIds)
    });
  }
};

export const threadMessageGetList = (threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_GET_MESSAGE_LIST(),
      payload: chatSDK.getThreadMessageList(threadId)
    });
  }
};

export const threadSearchMessage = (threadId, query) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_SEARCH_MESSAGE(),
      payload: chatSDK.getThreadMessageListByQuery(threadId, query)
    });
  }
};

export const threadGoToMessageId = (threadId, messageId) => {
  return (dispatch, getState) => {
    dispatch({
      type: THREAD_GO_TO_MESSAGE,
      payload: {threadId, messageId}
    });
  }
};

export const threadMessageGetListPartial = (threadId, msgId, loadBefore, count) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_GET_MESSAGE_LIST_PARTIAL(),
      payload: chatSDK.getThreadMessageListPartial(threadId, msgId, !loadBefore, count)
    });
  }
};

export const threadMessageGetListByMessageId = (threadId, msgId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(),
      payload: chatSDK.getThreadMessageListByMessageId(threadId, msgId)
    });
  }
};

export const threadParticipantList = (threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
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


export const threadModalImageCaptionShowing = isShowing => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_IMAGE_CAPTION_SHOWING,
      payload: isShowing
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
    const chatSDK = state.chatInstance.chatSDK;
    return dispatch({
      type: THREAD_PARTICIPANT_ADD(),
      payload: chatSDK.addParticipants(threadId, contactIds)
    });
  }
};


export const threadRemoveParticipant = (threadId, participants) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return dispatch({
      type: THREAD_PARTICIPANT_REMOVE(),
      payload: chatSDK.removeParticipants(threadId, participants)
    });
  }
};

export const threadInfo = (threadId, contactIds) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return dispatch({
      type: THREAD_PARTICIPANT_ADD(),
      payload: chatSDK.addParticipants(threadId, contactIds)
    });
  }
};

export const threadFilesToUpload = (files, upload) => {
  if (!upload) {
    let isAllImage = true;
    for (let file of files) {
      if (!~file.type.indexOf("image")) {
        isAllImage = false;
        break;
      }
    }
    if (isAllImage) {
      return threadImagesToCaption(files);
    }
  }
  return (dispatch) => {
    return dispatch({
      type: THREAD_FILES_TO_UPLOAD,
      payload: files
    });
  }
};

export const threadMetaUpdate = (meta, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return dispatch({
      type: THREAD_META_UPDATE,
      payload: chatSDK.updateThreadInfo(meta, threadId)
    });
  }
};

export const threadImagesToCaption = (images) => {
  return (dispatch) => {
    dispatch(threadModalImageCaptionShowing(true));
    return dispatch({
      type: THREAD_IMAGES_TO_CAPTION,
      payload: images
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

export const threadLeftAsideShowing = isShowing => {
  return dispatch => {
    return dispatch({
      type: THREAD_LEFT_ASIDE_SHOWING,
      payload: isShowing
    });
  }
};
