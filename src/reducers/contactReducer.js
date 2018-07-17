import {CONTACT_GET_LIST, CONTACT_ADDING} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const contactGetListReducer =  (state = {
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


export const contactAddingReducer =  (state = {
  isAdding: false
}, action) => {
  switch (action.type) {
    case CONTACT_ADDING:
      return {isAdding: action.payload};
    default:
      return state;
  }
};
