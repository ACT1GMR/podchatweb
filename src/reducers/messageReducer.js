import {GET_CONTACT_LIST} from "../constants/actionTypes";

const initialState = {
  sentMessage: null,
  isFetching: true,
  isFetched: false,
  error: false
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACT_LIST():
      return {...state, isFetching: true};
    case GET_CONTACT_LIST("FETCHED"):
      return {...state, isFetching: false, isFetched: true, sentMessage: action.payload};
    case GET_CONTACT_LIST("REJECTED"):
      return {...state, isFetching: false, isFetched: true, error: action.payload};
    default:
      return state;
  }
};
