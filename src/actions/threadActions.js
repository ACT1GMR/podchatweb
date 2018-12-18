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
  THREAD_SHOWING,
  THREAD_MODAL_IMAGE_CAPTION_SHOWING,
  THREAD_IMAGES_TO_CAPTION,
  THREAD_META_UPDATE,
  THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID,
  THREAD_LEFT_ASIDE_SHOWING,
  THREAD_SEARCH_MESSAGE,
  THREAD_GO_TO_MESSAGE,
  THREAD_IS_SENDING_MESSAGE,
  THREAD_SELECT_MESSAGE_SHOWING,
  THREAD_CHECKED_MESSAGE_LIST_REMOVE,
  THREAD_CHECKED_MESSAGE_LIST_EMPTY, THREAD_CHECKED_MESSAGE_LIST_ADD, CONTACT_GET_LIST, THREAD_EMOJI_SHOWING
} from "../constants/actionTypes";

export const threadCreate = (contactId, thread, threadName, idType) => {
  return (dispatch, getState) => {
    dispatch(threadShowing(true));
    dispatch(threadSelectMessageShowing(false));
    dispatch(threadCheckedMessageList(null, null, true));
    dispatch(threadEmojiShowing(false));
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
      payload: chatSDK.createThread(contactId, threadName, idType)
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


export const threadModalImageCaptionShowing = (isShowing, inputNode) => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_IMAGE_CAPTION_SHOWING,
      payload: {isShowing, inputNode}
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

export const threadFilesToUpload = (files, upload, inputNode, caption) => {
  if (!upload) {
    let isAllImage = true;
    for (let file of files) {
      if (!~file.type.indexOf("image")) {
        isAllImage = false;
        break;
      }
    }
    if (isAllImage) {
      return threadImagesToCaption(files, inputNode);
    }
  }
  setTimeout(() => {
    inputNode.value = "";
  }, 1000);
  return (dispatch) => {
    return dispatch({
      type: THREAD_FILES_TO_UPLOAD,
      payload: {caption, files}
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

export const threadImagesToCaption = (images, inputNode) => {
  return (dispatch) => {
    dispatch(threadModalImageCaptionShowing(true, inputNode));
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

export const threadEmojiShowing = isShowing => {
  return dispatch => {
    return dispatch({
      type: THREAD_EMOJI_SHOWING,
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

export const threadSelectMessageShowing = isShowing => {
  return dispatch => {
    return dispatch({
      type: THREAD_SELECT_MESSAGE_SHOWING,
      payload: isShowing
    });
  }
};

export const threadCheckedMessageList = (addTo, message, empty) => {
  return dispatch => {
    if (empty) {
      return dispatch({
        type: THREAD_CHECKED_MESSAGE_LIST_EMPTY,
        payload: null
      });
    }
    return dispatch({
      type: addTo ? THREAD_CHECKED_MESSAGE_LIST_ADD : THREAD_CHECKED_MESSAGE_LIST_REMOVE,
      payload: message
    });
  }
};

export const threadIsSendingMessage = isSending => {
  return dispatch => {
    return dispatch({
      type: THREAD_IS_SENDING_MESSAGE,
      payload: isSending
    });
  }
};
