import {
  contactAddingReducer,
  contactGetListReducer,
  contactAdd,
  contactBlockReducer,
  contactListShowingReducer,
  contactModalCreateGroupShowingReducer,
  contactChattingReducer, contactGetListPartialReducer
} from "./contactReducer";
import {
  threadNotificationReducer,
  threadMessageListReducer,
  threadMessageListPartialReducer,
  threadParticipantListReducer,
  threadParticipantListPartialReducer,
  threadCreateReducer,
  threadsReducer,
  threadsPartialReducer,
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
  threadEmojiShowingReducer
} from "./threadReducer";
import {
  messageNewReducer,
  messageEditingReducer
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
  contactGetListPartial: contactGetListPartialReducer,
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
  threads: threadsReducer,
  threadsPartial: threadsPartialReducer,
  threadParticipantList: threadParticipantListReducer,
  threadParticipantListPartial: threadParticipantListPartialReducer,
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
  messageNew: messageNewReducer,
  messageEditing: messageEditingReducer,
  user: userReducer,
};

export default rootReducer;