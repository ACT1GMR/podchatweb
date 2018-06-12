// src/actions/messageActions.js
import {GET_CONTACT_LIST} from "../constants/actionTypes";
import chatSDKWrapper from "../utils/chatSDKWrapper";

export const getContactList = () => {
  return dispatch => dispatch({
    type: GET_CONTACT_LIST(),
    payload: chatSDKWrapper.getContactList()
  });
};
