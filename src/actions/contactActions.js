// src/actions/messageActions.js
import {GET_CONTACT_LIST} from "../constants/actionTypes";

export const getContactList = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: GET_CONTACT_LIST(),
      payload: chatSDK.getContactList()
    });
  }
};
