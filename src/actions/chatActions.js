// src/actions/messageActions.js
import {
  CHAT_GET_INSTANCE,
  CHAT_SMALL_VERSION,
  THREAD_NEW,
  THREAD_CHANGED,
  THREAD_FILE_UPLOADING,
  CHAT_STATE,
  CHAT_MODAL_PROMPT_SHOWING,
  THREAD_REMOVED_FROM,
  CHAT_ROUTER_LESS,
  CHAT_SEARCH_RESULT,
  CHAT_SEARCH_SHOW,
  THREAD_PARTICIPANTS_LIST_CHANGE,
  THREADS_LIST_CHANGE, THREAD_LEAVE_PARTICIPANT, MESSAGE_DELETE
} from "../constants/actionTypes";
import {threadLeave} from "./threadActions";
import ChatSDK from "../utils/chatSDK";

export const chatSetInstance = config => {
  return (dispatch, state) => {
    dispatch({
      type: CHAT_GET_INSTANCE(),
      payload: null
    });
    new ChatSDK({
      config,
      onThreadEvents: (thread, type) => {

        switch (type) {
          case THREAD_NEW:
          case THREAD_PARTICIPANTS_LIST_CHANGE:
          case THREAD_LEAVE_PARTICIPANT:
          case THREADS_LIST_CHANGE:
            return dispatch({
              type: type,
              payload:
                type === THREAD_NEW ? thread.result.thread
                :
                type === THREADS_LIST_CHANGE ? thread.result.threads
                :
                type === THREAD_LEAVE_PARTICIPANT ? {threadId: thread.threadId, id: thread.result.participant.id}
                :
                type === THREAD_PARTICIPANTS_LIST_CHANGE ? {
                  threadId: thread.threadId,
                  participants: thread.result.participants
                } : thread
            });
          case THREAD_REMOVED_FROM:
            return dispatch(threadLeave(thread.result.thread, true));
          default:
            thread.changeType = type;
            dispatch({
              type: THREAD_CHANGED,
              payload: thread.result ? thread.result.thread : thread
            });
        }
      },
      onMessageEvents: (message, type) => {
        dispatch({
          type: type,
          payload: message
        });
      },
      onContactsEvents: (contacts, type) => {
        dispatch({
          type: type,
          payload: contacts
        });
      },
      onFileUploadEvents: message => {
        dispatch({
          type: THREAD_FILE_UPLOADING,
          payload: {...message, hasError: message.state === "UPLOAD_ERROR"}
        });
      },
      onChatState(e) {
        dispatch({
          type: CHAT_STATE,
          payload: e
        });
      },
      onChatError(e) {
        console.log(e)
      },
      onChatReady(e) {
        dispatch({
          type: CHAT_GET_INSTANCE("SUCCESS"),
          payload: e
        })
      }
    });
  }
};

export const chatUploadImage = (image, threadId, callBack) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.uploadImage(image, threadId).then(callBack);
  }
};

export const chatSmallVersion = isSmall => {
  return dispatch => {
    return dispatch({
      type: CHAT_SMALL_VERSION,
      payload: isSmall
    });
  }
};

export const chatRouterLess = isRouterLess => {
  return dispatch => {
    return dispatch({
      type: CHAT_ROUTER_LESS,
      payload: isRouterLess
    });
  }
};

export const chatModalPrompt = (isShowing, message, onApply, onCancel, confirmText) => {
  return dispatch => {
    return dispatch({
      type: CHAT_MODAL_PROMPT_SHOWING,
      payload: {
        isShowing,
        message,
        onApply,
        onCancel,
        confirmText
      }
    });
  }
};

export const chatSearchResult = (isShowing, filteredThreads, filteredContacts) => {
  return dispatch => {
    return dispatch({
      type: CHAT_SEARCH_RESULT,
      payload: {
        isShowing,
        filteredThreads,
        filteredContacts
      }
    });
  }
};

export const chatSearchShow = isShow => {
  return dispatch => {
    return dispatch({
      type: CHAT_SEARCH_SHOW,
      payload: isShow
    });
  }
};

export const chatClearCache = ()=>{
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.clearCache();
  }
};