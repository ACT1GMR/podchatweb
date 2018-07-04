import {
  THREAD_CREATE,
  THREAD_GET_MESSAGE_LIST,
  THREAD_GET_LIST,
  THREAD_NEW,
  MESSAGE_NEW, THREAD_CHANGED, MESSAGE_SEEN
} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const createThreadReducer = (state = {
  thread: {},
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_CREATE("PENDING"):
      return {...state, ...stateObject("PENDING", {}, "thread")};
    case THREAD_NEW:
      return {...state, ...stateObject("SUCCESS", action.payload, "thread")};
    case THREAD_CREATE("CACHE"):
      return {...state, ...stateObject("SUCCESS", action.payload, "thread")};
    case THREAD_CHANGED: {
      let updatedThread = action.payload;
      let thread = state.thread;
      if (thread) {
        if (thread.id === updatedThread.id) {
          return {...state, ...stateObject("SUCCESS", updatedThread, "thread")};
        }
      }
      return state;
    }
    case THREAD_CREATE("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadsReducer = (state = {
  threads: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  const sortThreads = (threads) => {
    return threads.sort((a, b)=>b.time - a.time)
  };
  switch (action.type) {
    case THREAD_GET_LIST("PENDING"):
      return {...state, ...stateObject("PENDING", action.payload)};
    case THREAD_GET_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", sortThreads(action.payload), "threads")};
    case THREAD_CHANGED: {
      let updatedThread = action.payload;
      let threads = [...state.threads];
      let index = threads.findIndex(thread => thread.id === updatedThread.id);
      if (~index) {
        threads[index] = updatedThread;
      } else {
        threads.push(updatedThread);
      }
      return {...state, ...stateObject("SUCCESS", sortThreads(threads), "threads")};
    }
    case THREAD_GET_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};


export const threadMessageListReducer = (state = {
  messages: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  const checkForCurrentThread = () => {
    const firstMessage = state.messages[0];
    if (firstMessage) {
      if (action.payload.threadId === firstMessage.threadId) {
        return true;
      }
    }
  };
  switch (action.type) {
    case THREAD_CREATE("PENDING"):
      return {...state, ...stateObject("PENDING", [])};
    case THREAD_GET_MESSAGE_LIST("PENDING"):
      return {...state, ...stateObject("PENDING", action.payload)};
    case THREAD_GET_MESSAGE_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload.reverse(), "messages")};
    case THREAD_GET_MESSAGE_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    case MESSAGE_NEW: {
      if (!checkForCurrentThread()) {
        return state;
      }
      if (state.messages.filter(e => e.id === action.payload.id).length) {
        return state;
      }
      return {...state, messages: [...state.messages, action.payload]};
    }
    case MESSAGE_SEEN: {
      if (!checkForCurrentThread()) {
        return state;
      }
      let updatedMessage = action.payload;
      let messages = [...state.messages];
      let index = messages.findIndex(message => message.id === updatedMessage.id);
      if (!~index) {
        return state;
      }
      messages[index] = updatedMessage;
      return {...state, ...stateObject("SUCCESS", messages, "messages")};
    }
    default:
      return state;
  }
};