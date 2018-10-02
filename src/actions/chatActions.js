// src/actions/messageActions.js
import {THREAD_NEW, CHAT_GET_INSTANCE, THREAD_CHANGED, THREAD_FILE_UPLOADING} from "../constants/actionTypes";
import ChatSDK from "../utils/chatSDK";

export const chatSetInstance = config => {
  return (dispatch) => {
    dispatch({
      type: CHAT_GET_INSTANCE(),
      payload: null
    });
    const chatSDKInstance = new ChatSDK({
      config,
      onThreadEvents: (thread, type) => {
        thread.changeType = type;
        if(thread.changeType === THREAD_NEW) {
          return dispatch({
            type: THREAD_NEW,
            payload: thread
          });
        }
        dispatch({
          type: THREAD_CHANGED,
          payload: thread
        });
      },
      onMessageEvents: (message, type) => {
        dispatch({
          type: type,
          payload: message
        });
      },
      onFileUploadEvents: message => {
        dispatch({
          type: THREAD_FILE_UPLOADING,
          payload: message
        });
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
    const chatSDK = state.chat.chatSDK;
    chatSDK.uploadImage(image, threadId).then(callBack);
  }
};
