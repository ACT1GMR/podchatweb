import {GET_CONTACT_LIST, GET_CONTACT_LIST_FAILURE, GET_CONTACT_LIST_SUCCESS} from "../constants/ActionTypes";

const initialState = {
  contacts: {}
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACT_LIST:
      return {status: GET_CONTACT_LIST};
    case GET_CONTACT_LIST_FAILURE:
      return {status: GET_CONTACT_LIST_FAILURE, error: action.error};
    case GET_CONTACT_LIST_SUCCESS:
      return {status: GET_CONTACT_LIST_SUCCESS, contacts: action.response};
    default:
      return state;
  }
};
