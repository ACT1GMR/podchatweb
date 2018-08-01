// src/actions/messageActions.js
import {THREAD_NEW, CHAT_GET_INSTANCE, MESSAGE_NEW, CONTACT_GET_LIST, THREAD_CHANGED} from "../constants/actionTypes";
import ChatSDK from "../utils/chatSDK";
import {stateObject} from "../utils/serviceStateGenerator";

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
      onChatReady(e) {
        dispatch({
          type: CHAT_GET_INSTANCE("SUCCESS"),
          payload: e
        })
      }
    });
  }
};
