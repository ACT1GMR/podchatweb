import {
  MESSAGE_SEND,
  MESSAGE_EDITING,
  MESSAGE_EDIT,
  MESSAGE_NEW,
  MESSAGE_SEEN,
  MESSAGE_MODAL_DELETE_PROMPT_SHOWING,
  MESSAGE_DELETING
} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const messageSendReducer = (state = {
  sentMessage: null,
  fetching: true,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case MESSAGE_SEND("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case MESSAGE_SEND("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case MESSAGE_SEND("ERROR"):
      return {...state, ...stateObject("ERROR")};
    default:
      return state;
  }
};

export const messageEditingReducer = (state = null, action) => {
  switch (action.type) {
    case MESSAGE_EDITING:
      return action.payload;
    default:
      return state;
  }
};

export const messageEditReducer = (state = {
  sentMessage: null,
  fetching: true,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case MESSAGE_EDIT("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case MESSAGE_EDIT("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case MESSAGE_EDIT("ERROR"):
      return {...state, ...stateObject("ERROR")};
    default:
      return state;
  }
};

export const messageDeleteReducer = (state = {
  deleteMessage: null,
  fetching: true,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case MESSAGE_DELETING("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case MESSAGE_DELETING("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case MESSAGE_DELETING("ERROR"):
      return {...state, ...stateObject("ERROR")};
    default:
      return state;
  }
};

export const messageNewReducer = (state = {
  message: null
}, action) => {
  switch (action.type) {
    case MESSAGE_NEW:
      return {...state, ...stateObject("SUCCESS", action.payload, "message")};
    default:
      return state;
  }
};

export const messageSeenReducer = (state = {
  lastSeenMessage: null
}, action) => {
  switch (action.type) {
    case MESSAGE_SEEN:
      return {...state, ...stateObject("SUCCESS", action.payload, "message")};
    default:
      return state;
  }
};


export const messageModalDeletePromptReducer = (state = {
  isShowing: false,
  message: null
}, action) => {
  switch (action.type) {
    case MESSAGE_MODAL_DELETE_PROMPT_SHOWING:
      return action.payload;
    default:
      return state;
  }
};
