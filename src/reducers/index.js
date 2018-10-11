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
  threadFilesToUploadReducer,
  threadParticipantAddReducer,
  threadParticipantRemoveReducer,
  threadModalMedialShowingReducer,
  threadShowingReducer,
  threadLeftAsideShowingReducer,
  threadSearchMessageReducer,
  threadImagesToCaptionReducer,
  threadModalImageCaptionShowingReducer,
  threadGoToMessageIdReducer,
  threadGetMessageListByMessageIdReducer
} from "./threadReducer";
import {messageSendReducer, messageNewReducer, messageEditingReducer, messageEditReducer} from "./messageReducer";
import {chatSmallVersionReducer, chatInstanceReducer} from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = {
  chatInstance: chatInstanceReducer,
  chatSmallVersion: chatSmallVersionReducer,
  contactGetList: contactGetListReducer,
  contactListShowing: contactListShowingReducer,
  contactModalCreateGroupShowing: contactModalCreateGroupShowingReducer,
  contactAdding: contactAddingReducer,
  contactAdd: contactAdd,
  contactChatting: contactChattingReducer,
  thread: threadCreateReducer,
  threadMessages: threadMessageListReducer,
  threadMessagesPartial: threadMessageListPartialReducer,
  threadModalListShowing: threadModalListShowingReducer,
  threadModalThreadInfoShowing: threadModalThreadInfoShowingReducer,
  threadModalMedialShowing: threadModalMedialShowingReducer,
  threadModalImageCaptionShowing: threadModalImageCaptionShowingReducer,
  threadList: threadsReducer,
  threadParticipantList: threadParticipantListReducer,
  threadParticipantAdd: threadParticipantAddReducer,
  threadParticipantRemove: threadParticipantRemoveReducer,
  threadFilesToUpload: threadFilesToUploadReducer,
  threadImagesToCaption: threadImagesToCaptionReducer,
  threadShowing: threadShowingReducer,
  threadLeftAsideShowing: threadLeftAsideShowingReducer,
  threadSearchMessage: threadSearchMessageReducer,
  threadGoToMessageId: threadGoToMessageIdReducer,
  threadGetMessageListByMessageId: threadGetMessageListByMessageIdReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  messageEditing: messageEditingReducer,
  messageEdit: messageEditReducer,
  user: userReducer,
};

export default rootReducer;