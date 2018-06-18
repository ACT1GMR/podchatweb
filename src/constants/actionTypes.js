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
  if (type === 'PENDING') {
    return `${baseMessage}_PENDING`;
  }
};

export const GET_CHAT_INSTANCE = buildPromiseMessage.bind(null, "GET_CHAT_INSTANCE");
export const SEND_MESSAGE = buildPromiseMessage.bind(null, "SEND_MESSAGE");
export const GET_CONTACT_LIST = buildPromiseMessage.bind(null, "GET_CONTACT_LIST");
export const GET_THREAD_MESSAGE_LIST = buildPromiseMessage.bind(null, "GET_THREAD_MESSAGE_LIST");
export const CREATE_THREAD = buildPromiseMessage.bind(null, "CREATE_THREAD");
export const NEW_MESSAGE = "NEW_MESSAGE";
export const NEW_THREAD = "NEW_THREAD";