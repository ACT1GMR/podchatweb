import {SEND_MESSAGE, NEW_MESSAGE} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const sendMessageReducer = (state = {
  sentMessage: null,
  fetching: true,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case SEND_MESSAGE("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case SEND_MESSAGE("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case SEND_MESSAGE("ERROR"):
      return {...state, ...stateObject("ERROR")};
    default:
      return state;
  }
};

export const newMessageReducer = (state = {
  message: null
}, action) => {
  switch (action.type) {
    case NEW_MESSAGE:
      return {...state, ...stateObject("SUCCESS", action.payload, "message")};
    default:
      return state;
  }
};
