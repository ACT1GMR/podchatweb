import {CREATE_THREAD, GET_THREAD_MESSAGE_LIST, SEND_MESSAGE} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const createThreadReducer = (state = {
  thread: {},
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CREATE_THREAD("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case CREATE_THREAD("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "thread")};
    case CREATE_THREAD("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};


export const threadMessageListReducer = (state = {
  messages: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case GET_THREAD_MESSAGE_LIST("PENDING"):
      return {...state,...stateObject("PENDING", action.payload)};
    case GET_THREAD_MESSAGE_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "messages")};
    case GET_THREAD_MESSAGE_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    case SEND_MESSAGE("SUCCESS"):
      return {...state, messages: [...state.messages, action.payload]};
    default:
      return state;
  }
};