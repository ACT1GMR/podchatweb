import {contactAddingReducer, contactGetListReducer, contactAdd} from "./contactReducer";
import {threadMessageListReducer, threadMessageListPartialReducer, createThreadReducer, threadsReducer} from "./threadReducer";
import {messageSendReducer, messageNewReducer} from "./messageReducer";
import chatReducer from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = {
  contactGetList: contactGetListReducer,
  contactAdding: contactAddingReducer,
  contactAdd: contactAdd,
  chat: chatReducer,
  thread: createThreadReducer,
  threadMessages: threadMessageListReducer,
  threadMessagesPartial: threadMessageListPartialReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  user: userReducer,
  threadList: threadsReducer
};

export default rootReducer;