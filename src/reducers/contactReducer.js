import {GET_CONTACT_LIST} from "../constants/actionTypes";
import {stateMessage, stateObject} from "../utils/serviceStateGenerator";

export default (state = {
  contacts: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case GET_CONTACT_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case GET_CONTACT_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "contacts")};
    case GET_CONTACT_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};
