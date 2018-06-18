import contactReducer from './contactReducer';
import {threadMessageListReducer, createThreadReducer} from './threadReducer';
import messageReducer from './messageReducer';
import chatReducer from './chatReducer';

const rootReducer = {
  contact: contactReducer,
  chat: chatReducer,
  threadMessages: threadMessageListReducer,
  thread: createThreadReducer,
  message: messageReducer,
};

export default rootReducer;