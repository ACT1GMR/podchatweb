import {CHAT_GET_INSTANCE, CHAT_SMALL_VERSION, THREAD_MODAL_LIST_SHOWING} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const chatInstanceReducer = (state = {
  chatSDK: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CHAT_GET_INSTANCE("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case CHAT_GET_INSTANCE("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "chatSDK")};
    case CHAT_GET_INSTANCE("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const chatSmallVersionReducer = (state = false, action) => {
  switch (action.type) {
    case CHAT_SMALL_VERSION:
      return action.payload;
    default:
      return state;
  }
};

