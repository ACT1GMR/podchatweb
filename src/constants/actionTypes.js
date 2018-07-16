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
export const USER_GET = buildPromiseMessage.bind(null, "USER_GET");
export const MESSAGE_SEND = buildPromiseMessage.bind(null, "MESSAGE_SEND");
export const MESSAGE_EDIT = buildPromiseMessage.bind(null, "MESSAGE_EDIT");
export const MESSAGE_NEW = "MESSAGE_NEW";
export const MESSAGE_SEEN = "MESSAGE_SEEN";
export const THREAD_GET_MESSAGE_LIST = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST");
export const THREAD_GET_MESSAGE_LIST_PARTIAL = buildPromiseMessage.bind(null, "THREAD_GET_MESSAGE_LIST_PARTIAL");
export const THREAD_CREATE = buildPromiseMessage.bind(null, "THREAD_CREATE");
export const THREAD_GET_LIST = buildPromiseMessage.bind(null, "THREAD_GET_LIST");
export const THREAD_NEW = "THREAD_NEW";
export const THREAD_CHANGED = "THREAD_CHANGED";
