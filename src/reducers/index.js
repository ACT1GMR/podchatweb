import {
  contactAddingReducer,
  contactGetListReducer,
  contactAdd,
  contactListShowingReducer,
  contactModalCreateGroupShowingReducer,
  contactChattingReducer
} from "./contactReducer";
import {
  threadMessageListReducer,
  threadMessageListPartialReducer,
  threadParticipantGetListReducer,
  threadCreateReducer,
  threadsReducer,
  threadModalListShowingReducer
} from "./threadReducer";
import {messageSendReducer, messageNewReducer, messageEditingReducer, messageEditReducer} from "./messageReducer";
import chatReducer from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = {
  contactGetList: contactGetListReducer,
  contactListShowing: contactListShowingReducer,
  contactModalCreateGroupShowing: contactModalCreateGroupShowingReducer,
  contactAdding: contactAddingReducer,
  contactAdd: contactAdd,
  contactChatting: contactChattingReducer,
  chat: chatReducer,
  thread: threadCreateReducer,
  threadMessages: threadMessageListReducer,
  threadMessagesPartial: threadMessageListPartialReducer,
  threadModalListShowing: threadModalListShowingReducer,
  threadList: threadsReducer,
  threadParticipantList: threadParticipantListReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  messageEditing: messageEditingReducer,
  messageEdit: messageEditReducer,
  user: userReducer,
};

export default rootReducer;