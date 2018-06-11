import {SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE, SEND_MESSAGE} from "../constants/ActionTypes";

const initialState = {
  messageSent: {}
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SENDING_MESSAGE:
      return {status: SENDING_MESSAGE};
    case SEND_MESSAGE_FAILURE:
      return {status: SEND_MESSAGE_FAILURE, error: action.error};
    case SEND_MESSAGE_SUCCESS:
      return {status: SEND_MESSAGE_SUCCESS, messageSent: action.response};
    default:
      return state;
  }
};
