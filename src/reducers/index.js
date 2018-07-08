import contactReducer from './contactReducer';
import {threadMessageListReducer, threadMessageListPartialReducer, createThreadReducer, threadsReducer} from './threadReducer';
import {messageSendReducer, messageNewReducer} from './messageReducer';
import chatReducer from './chatReducer';
import userReducer from './userReducer';

const rootReducer = {
  contact: contactReducer,
  chat: chatReducer,
  threadMessages: threadMessageListReducer,
  threadMessagesPartial: threadMessageListPartialReducer,
  thread: createThreadReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  user: userReducer,
  threadList: threadsReducer
};

export default rootReducer;