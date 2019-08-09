import {
  getThreadHistory,
  getThreadHistoryByQuery,
  getThreadHistoryInMiddle
} from "../utils/listing";

import {
  THREAD_CREATE,
  THREAD_GET_MESSAGE_LIST,
  THREAD_GET_LIST,
  THREAD_GET_MESSAGE_LIST_PARTIAL,
  THREAD_MODAL_LIST_SHOWING,
  THREAD_PARTICIPANT_GET_LIST,
  THREAD_PARTICIPANT_ADD,
  THREAD_MODAL_THREAD_INFO_SHOWING,
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
  THREAD_CHECKED_MESSAGE_LIST_EMPTY,
  THREAD_CHECKED_MESSAGE_LIST_ADD,
  THREAD_EMOJI_SHOWING,
  THREAD_NOTIFICATION,
  THREAD_REMOVED_FROM,
  THREAD_CREATE_INIT,
  THREAD_PARTICIPANTS_REMOVED, THREAD_NEW_MESSAGE, THREAD_CREATION_SCENARIO, THREAD_PARTICIPANT_GET_LIST_PARTIAL,
  THREAD_GET_LIST_PARTIAL
} from "../constants/actionTypes";
import {stateGeneratorState} from "../utils/storeHelper";

const {CANCELED, SUCCESS} = stateGeneratorState;


export const threadCreate = (contactId, thread, threadName, idType, isChannel) => {
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
      payload: chatSDK.createThread(contactId, threadName, idType, isChannel)
    });
  }
};

export const threadInit = () => {
  return (dispatch) => {
    dispatch(threadShowing(false));
    dispatch(threadSelectMessageShowing(false));
    dispatch(threadCheckedMessageList(null, null, true));
    dispatch(threadEmojiShowing(false));
    return dispatch({
      type: THREAD_CREATE_INIT,
      payload: null
    });
  }
};

export const threadGetList = (offset = 0, count, name, direct) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    if (direct) {
      return chatSDK.getThreads(offset, count, name);
    }
    dispatch({
      type: offset > 0 ? THREAD_GET_LIST_PARTIAL() : THREAD_GET_LIST(),
      payload: chatSDK.getThreads(offset, count, name)
    });
  }
};

export const threadMessageGetList = (threadId, count) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_GET_MESSAGE_LIST("PENDING"),
      payload: null
    });
    dispatch({
      type: THREAD_GET_MESSAGE_LIST(),
      payload: getThreadHistory(chatSDK, threadId, count)
    });
  }
};

export const threadMessageGetListPartial = (threadId, msgTime, loadAfter, count, reset) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    if (reset) {
      return dispatch({
        type: THREAD_GET_MESSAGE_LIST_PARTIAL(CANCELED),
        payload: null
      });
    }
    dispatch({
      type: THREAD_GET_MESSAGE_LIST_PARTIAL(),
      payload: getThreadHistory(chatSDK, threadId, count, msgTime, loadAfter)
    });
  }
};

export const threadMessageGetListByMessageId = (threadId, msgTime, count, reset) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    if (reset) {
      return dispatch({
        type: THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(CANCELED),
        payload: null
      });
    }
    dispatch({
      type: THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(),
      payload: getThreadHistoryInMiddle(chatSDK, threadId, msgTime, count)
    });
  }
};

export const threadSearchMessage = (threadId, query) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    if (!threadId) {
      return dispatch({
        type: THREAD_SEARCH_MESSAGE("SUCCESS"),
        payload: {messages: {reset: true}}
      });
    }
    dispatch({
      type: THREAD_SEARCH_MESSAGE(),
      payload: getThreadHistoryByQuery(chatSDK, threadId, query)
    });
  }
};

export const threadGoToMessageId = time => {
  return dispatch => {
    dispatch({
      type: THREAD_GO_TO_MESSAGE,
      payload: time
    });
  }
};

export const threadSpamPv = (threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.spamPvThread(threadId).then(e => {
      dispatch(threadInit());
      return dispatch({
        type: THREAD_REMOVED_FROM,
        payload: threadId
      });
    });

  }
};

export const threadLeave = (threadId, kickedOut) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    if (kickedOut) {
      dispatch({
        type: THREAD_REMOVED_FROM,
        payload: threadId
      });
      if (state.thread.thread.id === threadId) {
        dispatch(threadInit());
      }
      return;
    }
    chatSDK.leaveThread(threadId).then(e => {
      dispatch(threadInit());
      dispatch({
        type: THREAD_REMOVED_FROM,
        payload: threadId
      });
    });
  }
};

export const threadNewMessage = message => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: THREAD_NEW_MESSAGE,
      payload: message
    });
  }
};

export const threadParticipantList = (threadId, offset = 0, count, name, reset) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    if (!threadId) {
      return dispatch({
        type: THREAD_PARTICIPANT_GET_LIST(CANCELED)
      });
    }
    dispatch({
      type: offset > 0 ? THREAD_PARTICIPANT_GET_LIST_PARTIAL() : THREAD_PARTICIPANT_GET_LIST(),
      payload: chatSDK.getThreadParticipantList(threadId, offset, count, name)
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

export const threadModalThreadInfoShowing = isShowing => {
  return dispatch => {
    return dispatch({
      type: THREAD_MODAL_THREAD_INFO_SHOWING,
      payload: isShowing ? isShowing : false
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

export const threadRemoveParticipant = (threadId, participantIds) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return chatSDK.removeParticipants(threadId, participantIds).then(() => {
      return dispatch({
        type: THREAD_PARTICIPANTS_REMOVED,
        payload: {threadId, id: participantIds[0]}
      });
    })
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

export const threadLeftAsideShowing = (isShowing, type, data) => {
  return dispatch => {
    return dispatch({
      type: THREAD_LEFT_ASIDE_SHOWING,
      payload: {isShowing, type, data}
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

export const threadNotification = (threadId, mute) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    return dispatch({
      type: THREAD_NOTIFICATION(),
      payload: chatSDK.muteThread(threadId, mute)
    });
  }
};