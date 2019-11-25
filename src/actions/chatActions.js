// src/actions/messageActions.js
import {threadGetList, threadLeave} from "./threadActions";
import ChatSDK from "../utils/chatSDK";
import {reconnect} from "../pages/box/AsideHead";
import {stateGeneratorState} from "../utils/storeHelper";
import {
  CHAT_GET_INSTANCE,
  CHAT_SMALL_VERSION,
  CHAT_STATE,
  CHAT_MODAL_PROMPT_SHOWING,
  CHAT_ROUTER_LESS,
  CHAT_SEARCH_RESULT,
  CHAT_SEARCH_SHOW,
  THREAD_NEW,
  THREAD_CHANGED,
  THREAD_FILE_UPLOADING,
  THREAD_REMOVED_FROM,
  THREAD_PARTICIPANTS_LIST_CHANGE,
  THREADS_LIST_CHANGE,
  THREAD_LEAVE_PARTICIPANT,
  THREAD_GET_LIST,
  CHAT_STOP_TYPING,
  CHAT_IS_TYPING,
  CHAT_NOTIFICATION,
  CHAT_NOTIFICATION_CLICK_HOOK,
  CHAT_RETRY_HOOK,
  CHAT_SIGN_OUT_HOOK
} from "../constants/actionTypes";


let firstReadyPassed = false;

const {CANCELED, SUCCESS} = stateGeneratorState;
const typing = [];

function findInTyping(threadId, userId, remove) {
  let index = 0;
  for (const type of typing) {
    index++;
    if (type.user.userId === userId) {
      if (threadId === type.threadId) {
        if (remove) {
          return typing.splice(index, 1);
        }
        return type;
      }
    }
  }
  return {};
}

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
                type === THREAD_NEW ? {redirectToThread: thread.redirectToThread, thread: thread.result.thread}
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
      onSystemEvents: ({result, type}) => {
        if (type === "IS_TYPING") {
          const {thread: threadId, user} = result;
          const {threadId: oldThreadId, user: oldUser} = findInTyping(threadId, user.userId);

          if (oldThreadId) {
            const timeOutName = `${oldThreadId}${oldUser.userId}TimeOut`;
            clearTimeout(window[timeOutName]);
          } else {
            typing.push({threadId, user});
          }
          const timeOutName = `${threadId}${user.userId}TimeOut`;
          window[timeOutName] = setTimeout(() => {
            findInTyping(threadId, user.userId, true);
            dispatch({
              type: CHAT_STOP_TYPING,
              payload: {threadId, user}
            });
          }, 1500);
          return dispatch({
            type: CHAT_IS_TYPING,
            payload: {threadId, user}
          });
        }
      },
      onChatState(e) {
        dispatch({
          type: CHAT_STATE,
          payload: e
        });
      },
      onChatError(e) {
        if (e && e.code && e.code === 21) {
          const {chatRetryHook, chatInstance} = state();
          if (chatRetryHook) {
            if (!chatRetryHook()) {
              return;
            }
          }
          reconnect(chatInstance.chatSDK);
        }
        console.log(e)
      },
      onChatReady(e) {
        if (firstReadyPassed) {
          dispatch(threadGetList(0, 50, null, true)).then(threads => {
            dispatch({
              type: THREAD_GET_LIST(SUCCESS),
              payload: threads
            });
          })
        }
        firstReadyPassed = true;
        window.instance = e;
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

export const chatNotification = isNotification => {
  return dispatch => {
    return dispatch({
      type: CHAT_NOTIFICATION,
      payload: isNotification
    });
  }
};

export const chatNotificationClickHook = chatNotificationClickHook => {
  return {
    type: CHAT_NOTIFICATION_CLICK_HOOK,
    payload: thread => chatNotificationClickHook.bind(null, thread)
  }
};

export const chatRetryHook = chatRetryHookHook => {
  return {
    type: CHAT_RETRY_HOOK,
    payload: () => chatRetryHookHook
  }
};

export const chatSignOutHook = chatSignOutHookHook => {
  return {
    type: CHAT_SIGN_OUT_HOOK,
    payload: () => chatSignOutHookHook
  }
};

export const chatModalPrompt = (isShowing, message, onApply, onCancel, confirmText, customBody) => {
  return dispatch => {
    return dispatch({
      type: CHAT_MODAL_PROMPT_SHOWING,
      payload: {
        isShowing,
        message,
        onApply,
        onCancel,
        confirmText,
        customBody
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

export const chatClearCache = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.clearCache();
  }
};

export const startTyping = threadId => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.startTyping(threadId);
  }
};

export const stopTyping = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.stopTyping();
  }
};