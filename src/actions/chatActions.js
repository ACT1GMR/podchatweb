// src/actions/messageActions.js
import {NEW_THREAD, GET_CHAT_INSTANCE, NEW_MESSAGE} from "../constants/actionTypes";
import ChatSDK from "../utils/chatSDK";

export const setChatInstance = token => {
  return (dispatch) => {
    dispatch({
      type: GET_CHAT_INSTANCE(),
      payload: null
    });
    const chatSDKInstance = new ChatSDK({
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
      },
      onChatReady(e) {
        dispatch({
          type: GET_CHAT_INSTANCE("SUCCESS"),
          payload: e
        })
      }
    });
  }
};
