import {
  THREAD_CREATE,
  THREAD_GET_MESSAGE_LIST,
  THREAD_GET_MESSAGE_LIST_PARTIAL,
  THREAD_GET_LIST,
  THREAD_NEW,
  THREAD_PARTICIPANT_GET_LIST,
  MESSAGE_NEW, THREAD_CHANGED, MESSAGE_SEEN, MESSAGE_EDIT, CONTACT_LIST_SHOWING, THREAD_MODAL_LIST_SHOWING
} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const threadCreateReducer = (state = {
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
      const updatedThread = action.payload;
      const thread = state.thread;
      if (thread.id === updatedThread.id) {
        return {...state, ...stateObject("SUCCESS", updatedThread, "thread")};
      }
      return state;
    }
    case THREAD_CREATE("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadModalListShowingReducer = (state = {
  details: {}
}, action) => {
  switch (action.type) {
    case THREAD_MODAL_LIST_SHOWING:
      return {details: action.payload};
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
    return threads.sort((a, b) => b.time - a.time)
  };
  switch (action.type) {
    case THREAD_GET_LIST("PENDING"):
      return {...state, ...stateObject("PENDING", [], "threads")};
    case THREAD_GET_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", sortThreads(action.payload), "threads")};
    case THREAD_NEW:
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

export const threadMessageListPartialReducer = (state = {
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_GET_MESSAGE_LIST_PARTIAL("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case THREAD_GET_MESSAGE_LIST_PARTIAL("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case THREAD_GET_MESSAGE_LIST_PARTIAL("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadMessageListReducer = (state = {
  messages: [],
  threadId: null,
  hasNext: false,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  const checkForCurrentThread = () => {
    if (action.payload.threadId === state.threadId) {
      return true;
    }
  };
  switch (action.type) {
    case THREAD_CREATE("PENDING"):
      return {...state, ...stateObject("PENDING", [], "messages")};
    case THREAD_GET_MESSAGE_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case THREAD_GET_MESSAGE_LIST("SUCCESS"):
      let newStateInit = {...state, ...stateObject("SUCCESS", action.payload.messages.reverse(), "messages")};
      newStateInit = {...newStateInit, ...{threadId: action.payload.threadId}};
      return {...newStateInit, ...{hasNext: action.payload.hasNext}};
    case THREAD_GET_MESSAGE_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    case THREAD_GET_MESSAGE_LIST_PARTIAL("SUCCESS"):
      let newStatePartial = {...state, ...stateObject("SUCCESS", [...action.payload.messages.reverse(), ...state.messages], "messages")};
      newStateInit = {...newStateInit, ...{threadId: action.payload.threadId}};
      return {...newStatePartial, ...{hasNext: action.payload.hasNext}};
    case MESSAGE_NEW: {
      if (!checkForCurrentThread()) {
        return state;
      }
      if (state.messages.filter(e => e.id === action.payload.id).length) {
        return state;
      }
      return {...state, messages: [...state.messages, action.payload]};
    }
    case MESSAGE_EDIT():
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

export const threadParticipantListReducer = (state = {
  participants: [],
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_PARTICIPANT_GET_LIST("PENDING"):
      return {...state, ...stateObject("PENDING", [], "participants")};
    case THREAD_PARTICIPANT_GET_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "participants")};
    case THREAD_PARTICIPANT_GET_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};