import {GET_USER} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export default (state = {
  user: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case GET_USER("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case GET_USER("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "user")};
    case GET_USER("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};