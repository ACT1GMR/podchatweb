import chatSDKWrapper from "../utils/chatSDKWrapper";
import {SEND_MESSAGE} from "../constants/actionTypes";

export const sendMessage = (text, threadId) => {
  return dispatch({
    type: SEND_MESSAGE,
    payload: chatSDKWrapper.sendMessage(text, threadId)
  });
};