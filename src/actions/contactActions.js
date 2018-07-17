// src/actions/messageActions.js
import {CONTACT_GET_LIST, CONTACT_ADD, CONTACT_ADDING} from "../constants/actionTypes";

export const contactGetList = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    dispatch({
      type: CONTACT_GET_LIST(),
      payload: chatSDK.getContactList()
    });
  }
};


export const contactAdding = (isAdding) => {
  return dispatch => {
    return dispatch({
      type: CONTACT_ADDING,
      payload: isAdding
    });
  }
};


export const contactAdd = (mobilePhone, firstName, lastName) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chat.chatSDK;
    return dispatch({
      type: CONTACT_ADD(),
      payload: chatSDK.addContact(mobilePhone, firstName, lastName)
    });
  }
};
