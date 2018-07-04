import {CONTACT_GET_LIST} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export default (state = {
  contacts: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CONTACT_GET_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case CONTACT_GET_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "contacts")};
    case CONTACT_GET_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};
