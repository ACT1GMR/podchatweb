// src/actions/messageActions.js
import {CONTACT_GET_LIST} from "../constants/actionTypes";

export const getContactList = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: CONTACT_GET_LIST(),
      payload: chatSDK.getContactList()
    });
  }
};
