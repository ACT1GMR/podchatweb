import {contactAddingReducer, contactGetListReducer, contactAdd, contactListShowingReducer, contactChattingReducer} from "./contactReducer";
import {threadMessageListReducer, threadMessageListPartialReducer, threadCreateReducer, threadsReducer} from "./threadReducer";
import {messageSendReducer, messageNewReducer, messageEditingReducer, messageEditReducer} from "./messageReducer";
import chatReducer from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = {
  contactGetList: contactGetListReducer,
  contactListShowing: contactListShowingReducer,
  contactAdding: contactAddingReducer,
  contactAdd: contactAdd,
  contactChatting: contactChattingReducer,
  chat: chatReducer,
  thread: threadCreateReducer,
  threadMessages: threadMessageListReducer,
  threadMessagesPartial: threadMessageListPartialReducer,
  threadList: threadsReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  messageEditing: messageEditingReducer,
  messageEdit: messageEditReducer,
  user: userReducer,
};

export default rootReducer;