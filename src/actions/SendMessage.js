// src/actions/SendMessage.js
import {
  SEND_MESSAGE,
  CREATE_THREAD_FAILURE,
  CREATE_THREAD_SUCCESS,
  SEND_MESSAGE_FAILURE, SEND_MESSAGE_SUCCESS
} from "../constants/ActionTypes";
import chatSDKWrapper from "../utils/ChatSDKWrapper";

export const sendMessageService = (text, userId) => {
  dispatch(sendMessage());
  return dispatch => {
    chatSDKWrapper.sendMessage(text, userId).then((response, error) => {
      if(response) {
        return dispatch(sendMessageSuccess(response));
      }
      dispatch(sendMessageFailure(error));
    });
  }
};

export const sendMessage = () => {type: SEND_MESSAGE};
export const sendMessageFailure = error => {type: SEND_MESSAGE_FAILURE, error};
export const sendMessageSuccess = response => {type: SEND_MESSAGE_SUCCESS, response};

