// src/actions/messageActions.js
import {CONTACT_GET_LIST, CONTACT_ADD, CONTACT_ADDING, THREAD_CREATE} from "../constants/actionTypes";
import {threadCreate, threadMessageGetList} from "./threadActions";

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
    chatSDK.addContact(mobilePhone, firstName, lastName).then(e => {
      dispatch({
        type: CONTACT_ADD("SUCCESS"),
        payload: e
      });
      dispatch(threadCreate(e.id, null, true));
    }, e => {
      dispatch({
        type: CONTACT_ADD("ERROR"),
        payload: e
      });
    });
    dispatch({
      type: CONTACT_ADD("PENDING"),
      payload: null
    });
  }
};
