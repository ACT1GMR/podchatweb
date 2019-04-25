import {
  MESSAGE_NEW,
  MESSAGE_SEEN,
  MESSAGE_EDIT,
  MESSAGE_DELETE,
  MESSAGE_SEND,
  MESSAGE_SENDING_ERROR,
  MESSAGE_FILE_UPLOAD_CANCEL,
  THREAD_CREATE,
  THREAD_GET_MESSAGE_LIST,
  THREAD_GET_MESSAGE_LIST_PARTIAL,
  THREAD_GET_LIST,
  THREAD_NEW,
  THREAD_PARTICIPANT_GET_LIST,
  THREAD_PARTICIPANT_ADD,
  THREAD_MODAL_LIST_SHOWING,
  THREAD_MODAL_THREAD_INFO_SHOWING,
  THREAD_CHANGED,
  THREAD_PARTICIPANT_REMOVE,
  THREAD_MODAL_MEDIA_SHOWING,
  THREAD_FILES_TO_UPLOAD,
  THREAD_FILE_UPLOADING,
  THREAD_SHOWING,
  THREAD_MODAL_IMAGE_CAPTION_SHOWING,
  THREAD_IMAGES_TO_CAPTION,
  THREAD_LEFT_ASIDE_SHOWING,
  THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID,
  THREAD_SEARCH_MESSAGE,
  THREAD_GO_TO_MESSAGE,
  THREAD_SPAM_PV,
  THREAD_IS_SENDING_MESSAGE,
  THREAD_SELECT_MESSAGE_SHOWING,
  THREAD_CHECKED_MESSAGE_LIST_EMPTY,
  THREAD_CHECKED_MESSAGE_LIST_ADD,
  THREAD_CHECKED_MESSAGE_LIST_REMOVE,
  THREAD_REMOVED_FROM,
  THREAD_EMOJI_SHOWING,
  THREAD_CREATE_INIT,
  THREAD_PARTICIPANTS_REMOVED, THREAD_NOTIFICATION,
} from "../constants/actionTypes";
import {stateObject} from "../utils/serviceStateGenerator";

export const threadCreateReducer = (state = {
  thread: {},
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_CREATE_INIT:
      return {...state, ...stateObject("SUCCESS", {}, "thread")};
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

export const threadModalListShowingReducer = (state = {}, action) => {
  switch (action.type) {
    case THREAD_MODAL_LIST_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const threadModalMedialShowingReducer = (state = {
  object: {}
}, action) => {
  switch (action.type) {
    case THREAD_MODAL_MEDIA_SHOWING:
      return {object: action.payload};
    default:
      return state;
  }
};

export const threadFilesToUploadReducer = (state = null, action) => {
  switch (action.type) {
    case THREAD_FILES_TO_UPLOAD:
      return action.payload;
    default:
      return state;
  }
};

export const threadImagesToCaptionReducer = (state = null, action) => {
  switch (action.type) {
    case THREAD_IMAGES_TO_CAPTION:
      return action.payload;
    default:
      return state;
  }
};

export const threadModalThreadInfoShowingReducer = (state = {
  isShow: false
}, action) => {
  switch (action.type) {
    case THREAD_MODAL_THREAD_INFO_SHOWING:
      return {isShow: action.payload};
    default:
      return state;
  }
};

export const threadModalImageCaptionShowingReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_MODAL_IMAGE_CAPTION_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const threadSelectMessageShowingReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_SELECT_MESSAGE_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const threadGoToMessageIdReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_GO_TO_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

export const threadShowingReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const threadLeftAsideShowingReducer = (state = {
  isShowing: false,
  type: null,
  data: null
}, action) => {
  switch (action.type) {
    case THREAD_LEFT_ASIDE_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const threadEmojiShowingReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_EMOJI_SHOWING:
      return action.payload;
    default:
      return state;
  }
};

export const threadIsSendingMessageReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_IS_SENDING_MESSAGE:
      return action.payload;
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
  const threads = [...state.threads];
  let index;
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
    case THREAD_REMOVED_FROM:
      index = threads.findIndex(thread => thread.id === action.payload);
      if (~index) {
        threads.splice(index, 1);
      }
      return {...state, ...stateObject("SUCCESS", sortThreads(threads), "threads")};
    case MESSAGE_SEEN("SUCCESS"):
      index = threads.findIndex(thread => thread.id === action.payload.threadId);
      if (~index) {
        threads[index].unreadCount = 0;
      }
      return {...state, ...stateObject("SUCCESS", sortThreads(threads), "threads")};
    default:
      return state;
  }
};

export const threadSearchMessageReducer = (state = {
  messages: {
    reset: true
  },
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_SEARCH_MESSAGE("PENDING"):
      return {...state, ...stateObject("PENDING", [], "messages")};
    case THREAD_SEARCH_MESSAGE("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "messages")};
    case THREAD_SEARCH_MESSAGE("ERROR"):
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

export const threadGetMessageListByMessageIdReducer = (state = {
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID("SUCCESS"):
      return {...state, ...stateObject("SUCCESS")};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadMessageListReducer = (state = {
  messages: [],
  threadId: null,
  hasNext: false,
  hasPrevious: false,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  function checkForCurrentThread() {
    if (action.payload.threadId === state.threadId) {
      return true;
    }
  }

  function removeDuplicate(state) {
    let messages = [...state.messages];
    const checkedIds = [];
    const removeIndexes = [];
    for (const message of messages) {
      if (!message.id) {
        continue;
      }
      const index = checkedIds.findIndex(id => id === message.id);
      if (~index) {
        removeIndexes.push(index);
      }
      checkedIds.push(message.id);
    }
    removeIndexes.forEach(index => messages.splice(index, 1));
    messages = messages.sort((a, b) => a.time - b.time);
    state.messages = messages;
    return state;
  }

  function updateMessage(field, value, criteria, upsert, remove, checkanyway) {
    const messagesClone = [...state.messages];
    const uniqueId = action.payload.uniqueId;

    if (!checkanyway && !checkForCurrentThread()) {
      return state;
    }
    let fileIndex = messagesClone.findIndex(criteria || (message => message.uniqueId === uniqueId));
    if (~fileIndex) {
      if (field) {
        messagesClone[fileIndex][field] = value;
      } else {
        if (remove) {
          messagesClone.splice(fileIndex, 1);
        } else {
          messagesClone[fileIndex] = value;
        }
      }
      return removeDuplicate({...state, ...stateObject("SUCCESS", messagesClone, "messages")});
    } else {
      if (upsert) {
        messagesClone.push(value);
        return removeDuplicate({...state, ...stateObject("SUCCESS", messagesClone, "messages")});
      }
      return state;
    }
  }


  let hasNext = state.hasNext;
  let hasPrevious = state.hasPrevious;
  if (action.payload) {
    hasNext = action.payload.hasNext !== null ? action.payload.hasNext : state.hasNext;
    hasPrevious = action.payload.hasPrevious !== null ? action.payload.hasPrevious : state.hasPrevious;
  }

  switch (action.type) {
    case THREAD_CREATE("PENDING"):
      return {...state, ...stateObject("PENDING", [], "messages")};
    case THREAD_GET_MESSAGE_LIST("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID("PENDING"):
      return {...state, ...stateObject("SUCCESS", [], "messages")};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID("SUCCESS"):
    case THREAD_GET_MESSAGE_LIST("SUCCESS"):
      let newStateInit = {...state, ...stateObject("SUCCESS", action.payload.messages, "messages")};
      newStateInit = {...newStateInit, ...{threadId: action.payload.threadId}};
      return removeDuplicate({...newStateInit, ...{hasPrevious, hasNext}});
    case THREAD_GET_MESSAGE_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    case THREAD_FILE_UPLOADING:
      return updateMessage("progress", action.payload, function (message) {
        return message.fileUniqueId === action.payload.uniqueId;
      });
    case THREAD_GET_MESSAGE_LIST_PARTIAL("SUCCESS"):
      let newStatePartial = {...state, ...stateObject("SUCCESS", [...action.payload.messages, ...state.messages], "messages")};
      newStateInit = {...newStateInit, ...{threadId: action.payload.threadId}};
      return removeDuplicate({...newStatePartial, ...{hasPrevious, hasNext}});
    case MESSAGE_SENDING_ERROR:
      return updateMessage("hasError", true);
    case MESSAGE_FILE_UPLOAD_CANCEL("SUCCESS"):
      return updateMessage(null, null, function (message) {
        return message.fileUniqueId === action.payload.uniqueId;
      }, null, true);
    case MESSAGE_NEW:
    case MESSAGE_SEND("SUCCESS"):
      if (!checkForCurrentThread()) {
        return state;
      }
      if (action.payload.id) {
        const idFilter = state.messages.filter(e => e.id === action.payload.id);
        if (idFilter.length) {
          return state;
        }
        return updateMessage(null, action.payload, null, true);
      }
      return removeDuplicate({...state, messages: [...state.messages, action.payload]});
    case MESSAGE_EDIT():
    case MESSAGE_SEEN("SUCCESS"):
      const newState = updateMessage("seen", true, message => message.id === action.payload, null, null, true);
      const newMessagesClone = newState.messages;
      return {...newState, ...stateObject("SUCCESS", newMessagesClone, "messages")};
    case MESSAGE_DELETE:
      return updateMessage(null, null, message => message.id === action.payload.id, null, true, true);
    default:
      return state;
  }
};


export const threadCheckedMessageListReducer = (state = [], action) => {
  switch (action.type) {
    case THREAD_CHECKED_MESSAGE_LIST_EMPTY:
      return [];
    case THREAD_CHECKED_MESSAGE_LIST_ADD:
      return [...state, ...[action.payload]].sort((a, b) => a.time - b.time);
    case THREAD_CHECKED_MESSAGE_LIST_REMOVE:
      let messages = [...state];
      let fileIndex = messages.findIndex((message => message.uniqueId === action.payload.uniqueId));
      messages.splice(fileIndex, 1);
      return messages;
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
      return {...state, ...stateObject("PENDING", state.participants, "participants")};
    case THREAD_PARTICIPANT_GET_LIST("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "participants")};
    case THREAD_PARTICIPANTS_REMOVED:
      const participants = action.payload.participantIds;
      const threadId = action.payload.threadId;
      const oldParticipants = state.participants;
      for (const participant of participants) {
        const index = oldParticipants.findIndex(prt => participant === prt.id && prt.threadId === threadId);
        if (index > -1) {
          oldParticipants.splice(index, 1);
        }
      }
      return {...state, ...stateObject("SUCCESS", oldParticipants, "participants")};
    case THREAD_PARTICIPANT_GET_LIST("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadSpamPVReducer = (state = {
  thread: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_SPAM_PV("PENDING"):
      return {...state, ...stateObject("PENDING", state.participants, "thread")};
    case THREAD_SPAM_PV("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "thread")};
    case THREAD_SPAM_PV("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadLeaveReducer = (state = {
  thread: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_SPAM_PV("PENDING"):
      return {...state, ...stateObject("PENDING", state.participants, "thread")};
    case THREAD_SPAM_PV("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "thread")};
    case THREAD_SPAM_PV("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadNotificationReducer = (state = {
  threadId: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_NOTIFICATION("PENDING"):
      return {...state, ...stateObject("PENDING")};
    case THREAD_NOTIFICATION("SUCCESS"):
      return {...state, ...stateObject("SUCCESS", action.payload, "threadId")};
    case THREAD_NOTIFICATION("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

export const threadParticipantAddReducer = (state = {
  thread: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_PARTICIPANT_ADD("PENDING"):
      return {...state, ...stateObject("PENDING", null, "thread")};
    case THREAD_PARTICIPANT_ADD("SUCCESS"): {
      let thread = action.payload;
      thread.timestamp = Date.now();
      return {...state, ...stateObject("SUCCESS", thread, "thread")};
    }
    case THREAD_PARTICIPANT_ADD("ERROR"):
      return {...state, ...stateObject("ERROR", action.payload)};
    default:
      return state;
  }
};

