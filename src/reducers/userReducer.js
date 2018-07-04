import {USER_GET} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export default (state = {
  user: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case USER_GET("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case USER_GET("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "user")};
    case USER_GET("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};