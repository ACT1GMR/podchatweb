import {MESSAGE_SEND, MESSAGE_EDITING, MESSAGE_EDIT, MESSAGE_NEW, MESSAGE_SEEN} from "../constants/actionTypes";
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

export const messageEditingReducer = (state = {
  message: null,
  fetching: true,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case MESSAGE_EDITING:
      return {...state, ...stateObject("SUCCESS", action.payload, "message")};
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