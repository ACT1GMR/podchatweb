// src/actions/SendMessage.js
import {GET_CONTACT_LIST, GET_CONTACT_LIST_FAILURE, GET_CONTACT_LIST_SUCCESS} from "../constants/ActionTypes";
import chatSDKWrapper from "../utils/ChatSDKWrapper";

export const getContactListService = () => {
  dispatch(getContactList());
  return dispatch => {
    chatSDKWrapper.getContactList().then((response, error) => {
      if(response) {
        return dispatch(getContactListSuccess(response));
      }
      dispatch(getContactListFailure(error));
    });
  }
};

export const getContactList = () => {type: GET_CONTACT_LIST};
export const getContactListFailure = error => {type: GET_CONTACT_LIST_FAILURE, error};
export const getContactListSuccess = response => {type: GET_CONTACT_LIST_SUCCESS, response};

