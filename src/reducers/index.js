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
  threadParticipantListReducer,
  threadCreateReducer,
  threadsReducer,
  threadModalListShowingReducer,
  threadModalThreadInfoShowingReducer,
  threadParticipantAddReducer, threadParticipantRemoveReducer, threadModalMedialShowingReducer
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
  threadModalThreadInfoShowing: threadModalThreadInfoShowingReducer,
  threadModalMedialShowing: threadModalMedialShowingReducer,
  threadList: threadsReducer,
  threadParticipantList: threadParticipantListReducer,
  threadParticipantAdd: threadParticipantAddReducer,
  threadParticipantRemove: threadParticipantRemoveReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  messageEditing: messageEditingReducer,
  messageEdit: messageEditReducer,
  user: userReducer,
};

export default rootReducer;