import contactReducer from './contactReducer';
import {threadMessageListReducer, createThreadReducer, threadsReducer} from './threadReducer';
import {sendMessageReducer, newMessageReducer} from './messageReducer';
import chatReducer from './chatReducer';
import userReducer from './userReducer';

const rootReducer = {
  contact: contactReducer,
  chat: chatReducer,
  threadMessages: threadMessageListReducer,
  thread: createThreadReducer,
  message: newMessageReducer,
  sendMessage: sendMessageReducer,
  user: userReducer,
  threadList: threadsReducer
};

export default rootReducer;