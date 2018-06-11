// src/actions/SendMessage.js
import {CREATE_THREAD, CREATE_THREAD_FAILURE, CREATE_THREAD_SUCCESS} from "../constants/ActionTypes";
import chatSDKWrapper from "../utils/ChatSDKWrapper";

export const createThreadService = userId => {
  dispatch(createThread());
  return dispatch => {
    chatSDKWrapper.createThread(userId).then((response, error) => {
      if(response) {
        return dispatch(createThreadSuccess(response));
      }
      dispatch(createThreadFailure(error));
    });
  }
};

export const createThread = () => {type: CREATE_THREAD};
export const createThreadFailure = error => {type: CREATE_THREAD_FAILURE, error};
export const createThreadSuccess = response => {type: CREATE_THREAD_SUCCESS, response};

