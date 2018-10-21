export const buildPromiseMessage = (baseMessage, type) => {
  if(!type) {
    return baseMessage;
  }
  if (type === "ERROR") {
    return `${baseMessage}_REJECTED`;
  }
  if (type === "SUCCESS") {
    return `${baseMessage}_FULFILLED`;
  }
  if (type === "CACHE") {
    return `${baseMessage}_CACHE`;
  }
  if (type === "PENDING") {
    return `${baseMessage}_PENDING`;
  }
  if (type === "CANCELED") {
    return `${baseMessage}_CANCELED`;
  }
};

export const CHAT_GET_INSTANCE = buildPromiseMessage.bind(null, "CHAT_GET_INSTANCE");
export const CHAT_SMALL_VERSION = "CHAT_SMALL_VERSION";
export const CONTACT_GET_LIST = buildPromiseMessage.bind(null, "CONTACT_GET_LIST");
export const CONTACT_ADD = buildPromiseMessage.bind(null, "CONTACT_ADD");
export const CONTACT_ADDING = "CONTACT_ADDING";
export const CONTACT_LIST_SHOWING = "CONTACT_LIST_SHOWING";
export const CONTACT_CHATTING = "CONTACT_CHATTING";
export const CONTACT_MODAL_CREATE_GROUP_SHOWING = "CONTACT_MODAL_CREATE_GROUP_SHOWING";
export const USER_GET = buildPromiseMessage.bind(null, "USER_GET");
export const MESSAGE_SEND = buildPromiseMessage.bind(null, "MESSAGE_SEND");
export const MESSAGE_SENDING_ERROR = "MESSAGE_SENDING_ERROR";
export const MESSAGE_EDITING = "MESSAGE_EDITING";
export const MESSAGE_EDIT = buildPromiseMessage.bind(null, "MESSAGE_EDIT");
export const MESSAGE_DELETE = "MESSAGE_DELETE";
export const MESSAGE_DELETING = buildPromiseMessage.bind(null, "MESSAGE_DELETING");
export const MESSAGE_FORWARD = buildPromiseMessage.bind(null, "MESSAGE_FORWARD");
export const MESSAGE_NEW = "MESSAGE_NEW";
export const MESSAGE_SEEN = "MESSAGE_SEEN";
export const MESSAGE_FILE_UPLOAD_CANCEL = buildPromiseMessage.bind(null, "MESSAGE_FILE_UPLOAD_CANCEL");
export const MESSAGE_MODAL_DELETE_PROMPT_SHOWING = "MESSAGE_MODAL_DELETE_PROMPT_SHOWING";
export const THREAD_PARTICIPANT_GET_LIST = buildPromiseMessage.bind(null, "THREAD_PARTICIPANT_GET_LIST");
export const THREAD_PARTICIPANT_ADD = buildPromiseMessage.bind(null, "THREAD_PARTICIPANT_ADD");
export const THREAD_PARTICIPANT_REMOVE = buildPromiseMessage.bind(null, "THREAD_PARTICIPANT_REMOVE");
export const THREAD_GET_MESSAGE_LIST = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST");
export const THREAD_GET_MESSAGE_LIST_PARTIAL = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST_PARTIAL");
export const THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID");
export const THREAD_CREATE = buildPromiseMessage.bind(null, "THREAD_CREATE");
export const THREAD_GET_LIST = buildPromiseMessage.bind(null, "THREAD_GET_LIST");
export const THREAD_NEW = "THREAD_NEW";
export const THREAD_CHANGED = "THREAD_CHANGED";
export const THREAD_MODAL_LIST_SHOWING = "THREAD_MODAL_LIST_SHOWING";
export const THREAD_MODAL_IMAGE_CAPTION_SHOWING = "THREAD_MODAL_IMAGE_CAPTION_SHOWING";
export const THREAD_MODAL_MEDIA_SHOWING = "THREAD_MODAL_MEDIA_SHOWING";
export const THREAD_MODAL_THREAD_INFO_SHOWING = "THREAD_MODAL_THREAD_INFO_SHOWING";
export const THREAD_FILE_UPLOADING = "THREAD_FILE_UPLOADING";
export const THREAD_FILES_TO_UPLOAD = "THREAD_FILES_TO_UPLOAD";
export const THREAD_META_UPDATE = buildPromiseMessage.bind(null, "THREAD_META_UPDATE");
export const THREAD_NAME_UPDATE = buildPromiseMessage.bind(null, "THREAD_NAME_UPDATE");
export const THREAD_IMAGES_TO_CAPTION = "THREAD_IMAGES_TO_CAPTION";
export const THREAD_SHOWING = "THREAD_SHOWING";
export const THREAD_GO_TO_MESSAGE = "THREAD_GO_TO_MESSAGE";
export const THREAD_LEFT_ASIDE_SHOWING = "THREAD_LEFT_ASIDE_SHOWING";
export const THREAD_SEARCH_MESSAGE =  buildPromiseMessage.bind(null, "THREAD_SEARCH_MESSAGE");

