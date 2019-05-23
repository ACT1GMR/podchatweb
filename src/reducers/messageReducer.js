import {
  MESSAGE_EDITING,
  MESSAGE_NEW,
} from "../constants/actionTypes";
import {stateGenerator, stateGeneratorState} from "../utils/storeHelper";
const {PENDING} = stateGeneratorState;

export const messageEditingReducer = (state = null, action) => {
  switch (action.type) {
    case MESSAGE_EDITING:
      return action.payload;
    default:
      return state;
  }
};

export const messageNewReducer = (state = {
  message: null
}, action) => {
  switch (action.type) {
    case MESSAGE_NEW:
      return {...state, ...stateGenerator(PENDING, action.payload, "message")};
    default:
      return state;
  }
};