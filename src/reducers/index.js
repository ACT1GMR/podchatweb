import {
  contactAddingReducer,
  contactGetListReducer,
  contactAdd,
  contactBlockReducer,
  contactListShowingReducer,
  contactModalCreateGroupShowingReducer,
  contactChattingReducer
} from "./contactReducer";
import {
  threadNotificationReducer,
  threadMessageListReducer,
  threadMessageListPartialReducer,
  threadParticipantListReducer,
  threadCreateReducer,
  threadsReducer,
  threadModalListShowingReducer,
  threadModalThreadInfoShowingReducer,
  threadFilesToUploadReducer,
  threadParticipantAddReducer,
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
  threadCheckedMessageListReducer,
  threadEmojiShowingReducer, threadSpamPVReducer, threadLeaveReducer
} from "./threadReducer";
import {
  messageSendReducer,
  messageNewReducer,
  messageEditingReducer,
  messageEditReducer,
  messageDeleteReducer
} from "./messageReducer";
import {
  chatSmallVersionReducer,
  chatInstanceReducer,
  chatStateReducer,
  chatModalPromptReducer,
  chatRouterLessReducer,
  chatSearchResultReducer,
  chatSearchShowReducer
} from "./chatReducer";
import userReducer from "./userReducer";

const rootReducer = {
  chatInstance: chatInstanceReducer,
  chatState: chatStateReducer,
  chatModalPrompt: chatModalPromptReducer,
  chatSmallVersion: chatSmallVersionReducer,
  chatRouterLess: chatRouterLessReducer,
  chatSearchResult: chatSearchResultReducer,
  chatSearchShow: chatSearchShowReducer,
  contactGetList: contactGetListReducer,
  contactListShowing: contactListShowingReducer,
  contactModalCreateGroupShowing: contactModalCreateGroupShowingReducer,
  contactAdding: contactAddingReducer,
  contactAdd: contactAdd,
  contactBlock: contactBlockReducer,
  contactChatting: contactChattingReducer,
  thread: threadCreateReducer,
  threadNotification: threadNotificationReducer,
  threadMessages: threadMessageListReducer,
  threadEmojiShowing: threadEmojiShowingReducer,
  threadMessagesPartial: threadMessageListPartialReducer,
  threadModalListShowing: threadModalListShowingReducer,
  threadModalThreadInfoShowing: threadModalThreadInfoShowingReducer,
  threadModalMedialShowing: threadModalMedialShowingReducer,
  threadModalImageCaptionShowing: threadModalImageCaptionShowingReducer,
  threadList: threadsReducer,
  threadParticipantList: threadParticipantListReducer,
  threadParticipantAdd: threadParticipantAddReducer,
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
  messageEditing: messageEditingReducer,
  user: userReducer,
};

export default rootReducer;