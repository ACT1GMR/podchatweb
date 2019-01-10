import {
  CONTACT_GET_LIST,
  CONTACT_LIST_SHOWING,
  CONTACT_MODAL_CREATE_GROUP_SHOWING,
  CONTACT_ADDING,
  CONTACT_ADD,
  CONTACT_CHATTING, CONTACT_EDIT, CONTACT_GET_BLOCK_LIST
} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const contactGetListReducer = (state = {
  contacts: [],
  init: true,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CONTACT_GET_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case CONTACT_GET_LIST("SUCCESS"):
      let contacts = action.payload;
      if (contacts.length) {
        contacts = contacts.sort((a, b) => {
          if(!a.firstName) {return}
          return a.firstName.localeCompare(b.firstName)
        });
      }
      return {...state, ...stateObject("SUCCESS", contacts, "contacts")};
    case CONTACT_GET_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const contactGetBlockedListReducer = (state = {
  blocked: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CONTACT_GET_BLOCK_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case CONTACT_GET_BLOCK_LIST("SUCCESS"):
      let contacts = action.payload;
      if (contacts.length) {
        contacts = contacts.sort((a, b) => {
          return a.firstName.localeCompare(b.firstName)
        });
      }
      return {...state, ...stateObject("SUCCESS", contacts, "blocked")};
    case CONTACT_GET_BLOCK_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const contactAdd = (state = {
  contact: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CONTACT_ADD("PENDING"):
      return {...state, ...stateObject("PENDING", null, "contact")};
    case CONTACT_ADD("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "contact")};
    case CONTACT_ADD("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const contactAddingReducer = (state = {
  isShowing: false,
  editMode: false,
  contactEdit: null
}, action) => {
  switch (action.type) {
    case CONTACT_ADDING:
      return {
        isShowing: action.payload.isShowing,
        editMode: action.payload.editMode,
        contactEdit: action.payload.contactEdit
      };
    default:
      return state;
  }
};

export const contactChattingReducer = (state = {
  contact: false
}, action) => {
  switch (action.type) {
    case CONTACT_CHATTING:
      return {contact: action.payload};
    default:
      return state;
  }
};

export const contactListShowingReducer = (state = {
  isShow: false
}, action) => {
  switch (action.type) {
    case CONTACT_LIST_SHOWING:
      return {isShow: action.payload};
    default:
      return state;
  }
};

export const contactModalCreateGroupShowingReducer = (state = {
  isShow: false
}, action) => {
  switch (action.type) {
    case CONTACT_MODAL_CREATE_GROUP_SHOWING:
      return {isShow: action.payload};
    default:
      return state;
  }
};
