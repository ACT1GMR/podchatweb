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
};

export const CHAT_GET_INSTANCE = buildPromiseMessage.bind(null, "CHAT_GET_INSTANCE");
export const CONTACT_GET_LIST = buildPromiseMessage.bind(null, "CONTACT_GET_LIST");
export const CONTACT_ADD = buildPromiseMessage.bind(null, "CONTACT_ADD");
export const CONTACT_ADDING = "CONTACT_ADDING";
export const CONTACT_LIST_SHOWING = "CONTACT_LIST_SHOWING";
export const CONTACT_CHATTING = "CONTACT_CHATTING";
export const CONTACT_MODAL_CREATE_GROUP_SHOWING = "CONTACT_MODAL_CREATE_GROUP_SHOWING";
export const USER_GET = buildPromiseMessage.bind(null, "USER_GET");
export const MESSAGE_SEND = buildPromiseMessage.bind(null, "MESSAGE_SEND");
export const MESSAGE_EDITING = "MESSAGE_EDITING";
export const MESSAGE_EDIT = buildPromiseMessage.bind(null, "MESSAGE_EDIT");
export const MESSAGE_FORWARD = buildPromiseMessage.bind(null, "MESSAGE_FORWARD");
export const MESSAGE_NEW = "MESSAGE_NEW";
export const MESSAGE_SEEN = "MESSAGE_SEEN";
export const THREAD_PARTICIPANT_GET_LIST = buildPromiseMessage.bind(null, "THREAD_PARTICIPANT_GET_LIST");
export const THREAD_GET_MESSAGE_LIST = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST");
export const THREAD_GET_MESSAGE_LIST_PARTIAL = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST_PARTIAL");
export const THREAD_CREATE = buildPromiseMessage.bind(null, "THREAD_CREATE");
export const THREAD_GET_LIST = buildPromiseMessage.bind(null, "THREAD_GET_LIST");
export const THREAD_NEW = "THREAD_NEW";
export const THREAD_CHANGED = "THREAD_CHANGED";
export const THREAD_MODAL_LIST_SHOWING = "THREAD_MODAL_LIST_SHOWING";
