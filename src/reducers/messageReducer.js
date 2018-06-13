import {GET_CONTACT_LIST} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export default (state = {
  sentMessage: null,
  fetching: true,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case GET_CONTACT_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case GET_CONTACT_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case GET_CONTACT_LIST("ERROR"):
      return {...state, ...stateObject("ERROR")};
    default:
      return state;
  }
};
