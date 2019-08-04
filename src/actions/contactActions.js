// src/actions/messageActions.js
import {
  CONTACT_GET_LIST,
  CONTACT_GET_LIST_PARTIAL,
  CONTACT_ADD,
  CONTACT_ADDING,
  CONTACT_LIST_SHOWING,
  CONTACT_CHATTING,
  CONTACT_MODAL_CREATE_GROUP_SHOWING,
  CONTACT_BLOCK
} from "../constants/actionTypes";
import {threadCreate, threadParticipantList, threadShowing} from "./threadActions";
import {messageEditing} from "./messageActions";

export const contactGetList = (offset = 0, count, name) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: offset > 0 ? CONTACT_GET_LIST_PARTIAL() : CONTACT_GET_LIST(),
      payload: chatSDK.getContactList(offset, count)
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
      payload: isShowing ? isShowing : false
    });
  }
};

export const contactModalCreateGroupShowing = (isShowing, isChannel) => {
  return dispatch => {
    return dispatch({
      type: CONTACT_MODAL_CREATE_GROUP_SHOWING,
      payload: {isShowing, isChannel}
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

export const contactBlock = (threadId, block) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    dispatch({
      type: CONTACT_BLOCK("PENDING"),
      payload: null
    });
    chatSDK.blockContact(threadId, block).then(() => {
      dispatch({
        type: CONTACT_BLOCK("SUCCESS"),
        payload: null
      });
      dispatch(threadParticipantList(threadId));
      dispatch(messageEditing());
    }, () => {
      dispatch({
        type: CONTACT_BLOCK(),
        payload: null
      });
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
        return dispatch(contactAdding());
      }
      if (e.linkedUser) {
        dispatch(threadCreate(e.id, null, true));
        dispatch(threadShowing(true));
        dispatch(contactGetList());
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

export const contactRemove = (contactId, threadId) => {
  return (dispatch, getState) => {
    const state = getState();
    const chatSDK = state.chatInstance.chatSDK;
    chatSDK.removeContact(contactId).then(e => {
      dispatch(contactGetList());
      if(threadId) {
        dispatch(threadParticipantList(threadId));
      }
    });
  }
};