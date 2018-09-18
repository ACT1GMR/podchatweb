// src/actions/messageActions.js
import {
  CONTACT_GET_LIST,
  CONTACT_ADD,
  CONTACT_ADDING,
  CONTACT_LIST_SHOWING,
  CONTACT_CHATTING,
  CONTACT_MODAL_CREATE_GROUP_SHOWING,
  THREAD_CREATE
} from "../constants/actionTypes";
import {threadCreate, threadMessageGetList, threadShowing} from "./threadActions";

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

export const contactListShowing = (isShowing) => {
  return dispatch => {
    return dispatch({
      type: CONTACT_LIST_SHOWING,
      payload: isShowing
    });
  }
};


export const contactModalCreateGroupShowing = (isShowing) => {
  return dispatch => {
    return dispatch({
      type: CONTACT_MODAL_CREATE_GROUP_SHOWING,
      payload: isShowing
    });
  }
};


export const contactChatting = (contact) => {
  return dispatch => {
    return dispatch({
      type: CONTACT_CHATTING,
      payload: contact
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
      if (e.linkedUser) {
        dispatch(threadCreate(e.id, null, true));
        dispatch(threadShowing(true));
      }
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
