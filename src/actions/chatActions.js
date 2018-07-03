// src/actions/messageActions.js
import {NEW_THREAD, GET_CHAT_INSTANCE, NEW_MESSAGE, GET_CONTACT_LIST, THREAD_CHANGED} from "../constants/actionTypes";
import ChatSDK from "../utils/chatSDK";
import {stateObject} from "../utils/serviceStateGenerator";

export const setChatInstance = token => {
  return (dispatch) => {
    dispatch({
      type: GET_CHAT_INSTANCE(),
      payload: null
    });
    const chatSDKInstance = new ChatSDK({
      onThreadEvents: (thread, type) => {
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
          type: GET_CHAT_INSTANCE("SUCCESS"),
          payload: e
        })
      },

      //DEPRECATED
      onNewThread: e => {
        dispatch({
          type: NEW_THREAD,
          payload: e
        });
      },
      onMessage: e => {
        dispatch({
          type: NEW_MESSAGE,
          payload: e
        });
      }
    });
  }
};
