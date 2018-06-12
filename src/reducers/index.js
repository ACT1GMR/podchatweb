import contactReducer from './contactReducer';
import {threadMessageListReducer, createThreadReducer} from './threadReducer';
import messageReducer from './messageReducer';

const rootReducer = {
  contact: contactReducer,
  threadMessages: threadMessageListReducer,
  thread: createThreadReducer,
  message: messageReducer,
};

export default rootReducer;