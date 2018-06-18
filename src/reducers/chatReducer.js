import {GET_CHAT_INSTANCE} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export default (state = {
  chatSDK: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case GET_CHAT_INSTANCE("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case GET_CHAT_INSTANCE("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "chatSDK")};
    case GET_CHAT_INSTANCE("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};
