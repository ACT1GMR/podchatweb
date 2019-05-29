import {
  CONTACT_GET_LIST,
  CONTACT_LIST_SHOWING,
  CONTACT_MODAL_CREATE_GROUP_SHOWING,
  CONTACT_ADDING,
  CONTACT_ADD,
  CONTACT_CHATTING,
  CONTACT_BLOCK, CONTACTS_LIST_CHANGE
} from "../constants/actionTypes";
import {stateGenerator, stateGeneratorState} from "../utils/storeHelper";
const {PENDING, SUCCESS, ERROR} = stateGeneratorState;

export const contactGetListReducer = (state = {
  contacts: [],
  init: true,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CONTACT_GET_LIST(PENDING):
      return {...state, ...stateGenerator(PENDING)};
    case CONTACTS_LIST_CHANGE:
    case CONTACT_GET_LIST(SUCCESS):
      let contacts = action.payload;
      if (contacts.length) {
        contacts = contacts.sort((a, b) => {
          if (!a.firstName) {
            return
          }
          return a.firstName.localeCompare(b.firstName)
        });
      }
      return {...state, ...stateGenerator(SUCCESS, contacts, "contacts")};
    case CONTACT_GET_LIST(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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
    case CONTACT_ADD(PENDING):
      return {...state, ...stateGenerator(PENDING, null, "contact")};
    case CONTACT_ADD(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS, action.payload, "contact")};
    case CONTACT_ADD(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
    default:
      return state;
  }
};

export const contactBlockReducer = (state = {
  contact: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CONTACT_BLOCK(PENDING):
      return {...state, ...stateGenerator(PENDING, null, "contact")};
    case CONTACT_BLOCK(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS, action.payload, "contact")};
    case CONTACT_BLOCK(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
    default:
      return state;
  }
};

export const contactAddingReducer = (state = {
  isShowing: false,
  contactEdit: null
}, action) => {
  switch (action.type) {
    case CONTACT_ADDING:
      return {
        isShowing: action.payload.isShowing,
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

export const contactListShowingReducer = (state = false, action) => {
  switch (action.type) {
    case CONTACT_LIST_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const contactModalCreateGroupShowingReducer = (state = false, action) => {
  switch (action.type) {
    case CONTACT_MODAL_CREATE_GROUP_SHOWING:
      return action.payload;
    default:
      return state;
  }
};