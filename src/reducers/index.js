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
  threadIsSendingMessageReducer,
  threadSearchMessageReducer,
  threadImagesToCaptionReducer,
  threadModalImageCaptionShowingReducer,
  threadGoToMessageIdReducer,
  threadGetMessageListByMessageIdReducer,
  threadSelectMessageShowingReducer,
  threadCheckedMessageListReducer
} from "./threadReducer";
import {
  messageSendReducer,
  messageNewReducer,
  messageEditingReducer,
  messageEditReducer,
  messageModalDeletePromptReducer,
  messageDeleteReducer
} from "./messageReducer";
import {chatSmallVersionReducer, chatInstanceReducer, chatStateReducer} from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = {
  chatInstance: chatInstanceReducer,
  chatState: chatStateReducer,
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
  threadIsSendingMessage: threadIsSendingMessageReducer,
  threadSelectMessageShowing: threadSelectMessageShowingReducer,
  threadSearchMessage: threadSearchMessageReducer,
  threadGoToMessageId: threadGoToMessageIdReducer,
  threadGetMessageListByMessageId: threadGetMessageListByMessageIdReducer,
  threadCheckedMessageList: threadCheckedMessageListReducer,
  message: messageNewReducer,
  sendMessage: messageSendReducer,
  messageEditing: messageEditingReducer,
  messageEdit: messageEditReducer,
  messageDelete: messageDeleteReducer,
  messageModalDeletePrompt: messageModalDeletePromptReducer,
  user: userReducer,
};

export default rootReducer;