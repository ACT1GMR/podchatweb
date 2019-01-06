// src/actions/messageActions.js
import {
  CONTACT_GET_LIST,
  CONTACT_ADD,
  CONTACT_ADDING,
  CONTACT_LIST_SHOWING,
  CONTACT_CHATTING,
  CONTACT_MODAL_CREATE_GROUP_SHOWING,
  THREAD_CREATE, THREAD_GET_MESSAGE_LIST, CONTACT_REMOVE, CONTACT_EDIT
} from "../constants/actionTypes";
import {threadCreate, threadParticipantList, threadShowing} from "./threadActions";

export const contactGetList = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: CONTACT_GET_LIST(),
      payload: chatSDK.getContactList()
    });
  }
};

export const contactGetBlockList = () => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: CONTACT_GET_LIST(),
      payload: chatSDK.getBlockList()
    });
  }
};


export const contactAdding = (isShowing, contactEdit) => {
  return dispatch => {
    return dispatch({
      type: CONTACT_ADDING,
      payload: {isShowing, contactEdit}
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

export const contactBlock = (contactId, block, thread) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.blockContact(contactId, block).then(() => {
      dispatch(threadParticipantList(thread.id));
    });
  }
};

export const contactUnblock = blockId => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.unblockContact(blockId).then(e => {
      dispatch(contactGetList());
    });
  }
};

export const contactAdd = (mobilePhone, firstName, lastName, editMode) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.addContact(mobilePhone, firstName, lastName).then(e => {
      dispatch({
        type: CONTACT_ADD("SUCCESS"),
        payload: e
      });
      if (editMode) {
        return dispatch(contactListShowing(true));
      }
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

export const contactRemove = contactId => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.removeContact(contactId).then(e => {
      dispatch(contactGetList());
    });
  }
};