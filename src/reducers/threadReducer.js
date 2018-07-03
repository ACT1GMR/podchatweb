import {
  CREATE_THREAD,
  GET_THREAD_MESSAGE_LIST,
  GET_THREAD_LIST,
  NEW_THREAD,
  NEW_MESSAGE, THREAD_CHANGED
} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const createThreadReducer = (state = {
  thread: {},
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case CREATE_THREAD("PENDING"):
      return {...state, ...stateObject("PENDING", {}, "thread")};
    case NEW_THREAD:
      return {...state, ...stateObject("SUCCESS", action.payload, "thread")};
    case CREATE_THREAD("CACHE"):
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
    case CREATE_THREAD("ERROR"):
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
  switch (action.type) {
    case GET_THREAD_LIST("PENDING"):
      return {...state, ...stateObject("PENDING", action.payload)};
    case GET_THREAD_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload.reverse(), "threads")};
    case THREAD_CHANGED: {
      let updatedThread = action.payload;
      let threads = [...state.threads];
      let index = threads.findIndex(thread => thread.id === updatedThread.id);
      if (~index) {
        threads[index] = updatedThread;
      } else {
        threads.push(updatedThread);
      }
      return {...state, ...stateObject("SUCCESS", threads, "threads")};
    }
    case GET_THREAD_LIST("ERROR"):
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
  switch (action.type) {
    case CREATE_THREAD("PENDING"):
      return {...state, ...stateObject("PENDING", [])};
    case GET_THREAD_MESSAGE_LIST("PENDING"):
      return {...state, ...stateObject("PENDING", action.payload)};
    case GET_THREAD_MESSAGE_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload.reverse(), "messages")};
    case GET_THREAD_MESSAGE_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    case NEW_MESSAGE: {
      const firstMessage = state.messages[0];
      if (firstMessage) {
        if (action.payload.threadId !== firstMessage.threadId) {
          return state;
        }
      }
      if (state.messages.filter(e => e.id === action.payload.id).length) {
        return state;
      }
      return {...state, messages: [...state.messages, action.payload]};
    }
    default:
      return state;
  }
};