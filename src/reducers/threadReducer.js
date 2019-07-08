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
  THREAD_IS_SENDING_MESSAGE,
  THREAD_SELECT_MESSAGE_SHOWING,
  THREAD_CHECKED_MESSAGE_LIST_EMPTY,
  THREAD_CHECKED_MESSAGE_LIST_ADD,
  THREAD_CHECKED_MESSAGE_LIST_REMOVE,
  THREAD_REMOVED_FROM,
  THREAD_EMOJI_SHOWING,
  THREAD_CREATE_INIT,
  THREAD_PARTICIPANTS_REMOVED,
  THREAD_NOTIFICATION,
  THREAD_PARTICIPANTS_LIST_CHANGE,
  THREADS_LIST_CHANGE, THREAD_LEAVE_PARTICIPANT, MESSAGE_CANCEL, THREAD_NEW_MESSAGE
} from "../constants/actionTypes";
import {stateGenerator, updateStore, listUpdateStrategyMethods, stateGeneratorState} from "../utils/storeHelper";

const {PENDING, SUCCESS, ERROR, CANCELED} = stateGeneratorState;

export const threadCreateReducer = (state = {
  thread: {},
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_CREATE_INIT:
      return {...state, ...stateGenerator(SUCCESS, {}, "thread")};
    case THREAD_CREATE(PENDING):
      return {...state, ...stateGenerator(PENDING, {}, "thread")};
    case THREAD_NEW:
      return {...state, ...stateGenerator(SUCCESS, action.payload, "thread")};
    case THREAD_CREATE("CACHE"):
      return {...state, ...stateGenerator(SUCCESS, action.payload, "thread")};
    case THREADS_LIST_CHANGE:
      return {
        ...state, ...stateGenerator(SUCCESS, updateStore(state.thread, action.payload[0], {
          by: "id",
          method: listUpdateStrategyMethods.UPDATE
        }), "thread")
      };
    case THREAD_CHANGED:
      return {
        ...state, ...stateGenerator(SUCCESS, updateStore(state.thread, action.payload, {
          by: "id",
          method: listUpdateStrategyMethods.UPDATE
        }), "thread")
      };
    case THREAD_CREATE(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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

export const threadModalThreadInfoShowingReducer = (state = false, action) => {
  switch (action.type) {
    case THREAD_MODAL_THREAD_INFO_SHOWING:
      return action.payload;
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

export const threadGoToMessageIdReducer = (state = null, action) => {
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
  const sortThreads = threads => threads.sort((a, b) => b.time - a.time);
  switch (action.type) {
    case THREAD_GET_LIST(PENDING):
      return {...state, ...stateGenerator(PENDING, [], "threads")};
    case THREAD_GET_LIST(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS, sortThreads(action.payload), "threads")};
    case THREAD_NEW:
    case THREAD_CHANGED: {
      let threads = updateStore(state.threads, action.payload, {
        method: listUpdateStrategyMethods.UPDATE,
        upsert: true,
        by: "id"
      });
      return {...state, ...stateGenerator(SUCCESS, sortThreads(threads), "threads")};
    }
    case THREADS_LIST_CHANGE: {
      let threads = updateStore(state.threads, action.payload, {
        method: listUpdateStrategyMethods.UPDATE,
        upsert: true,
        by: "id"
      });
      return {...state, ...stateGenerator(SUCCESS, sortThreads(threads), "threads")};
    }
    case THREAD_GET_LIST(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
    case THREAD_REMOVED_FROM: {
      let threads = updateStore(state.threads, action.payload, {
        by: "id",
        method: listUpdateStrategyMethods.REMOVE
      });
      return {...state, ...stateGenerator(SUCCESS, sortThreads(threads), "threads")};
    }
    case MESSAGE_DELETE:
    case MESSAGE_EDIT(): {
      const filteredThread = state.threads.filter(thread => thread.lastMessageVO && thread.lastMessageVO.id === action.payload.id);
      if (!filteredThread.length) {
        return state;
      }
      const list = updateStore(
        filteredThread,
        {id: action.payload.threadId, lastMessageVO: action.payload, lastMessage: action.payload.message},
        {
          mix: true,
          by: "id",
          method: listUpdateStrategyMethods.UPDATE
        }
      );
      let threads = updateStore(state.threads, list, {
        by: "id",
        method: listUpdateStrategyMethods.UPDATE
      });
      return {...state, ...stateGenerator(SUCCESS, sortThreads(threads), "threads")};
    }
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
    case THREAD_SEARCH_MESSAGE(PENDING):
      return {...state, ...stateGenerator(PENDING, [], "messages")};
    case THREAD_SEARCH_MESSAGE(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS, action.payload, "messages")};
    case THREAD_SEARCH_MESSAGE(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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
    case THREAD_GET_MESSAGE_LIST_PARTIAL(CANCELED):
      return {...state, ...stateGenerator(CANCELED)};
    case THREAD_GET_MESSAGE_LIST_PARTIAL(PENDING):
      return {...state, ...stateGenerator(PENDING)};
    case THREAD_GET_MESSAGE_LIST_PARTIAL(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS)};
    case THREAD_GET_MESSAGE_LIST_PARTIAL(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(CANCELED):
      return {...state, ...stateGenerator(CANCELED)};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(PENDING):
      return {...state, ...stateGenerator(PENDING)};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS)};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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

  function sortMessages(state) {
    let messages = [...state.messages];
    messages = messages.sort((a, b) => a.time - b.time);
    state.messages = messages;
    return state;
  }

  function removeDuplicateMessages(state) {
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
    return state;
  }

  let newHasNext, newHasPrevious;
  let hasNext = state.hasNext;
  let hasPrevious = state.hasPrevious;
  if (action.payload) {
    newHasNext = action.payload.hasNext;
    newHasPrevious = action.payload.hasPrevious;
    hasNext = newHasNext !== null && newHasNext !== "UNKNOWN" ? newHasNext : state.hasNext;
    hasPrevious = newHasPrevious !== null && newHasPrevious !== "UNKNOWN" ? newHasPrevious : state.hasPrevious;
  }
  switch (action.type) {
    case THREAD_CREATE_INIT:
    case THREAD_CREATE("CACHE"):
    case THREAD_CREATE(PENDING):
    case THREAD_CREATE(SUCCESS): {
      if(action.type === THREAD_CREATE("CACHE")) {
        if(state.threadId === action.payload.id) {
          return state;
        }
      }
      const isSetThreadIdNull = action.type === THREAD_CREATE_INIT || action.type === THREAD_CREATE(PENDING);
      return {
        ...state, ...stateGenerator(PENDING, {
          threadId: isSetThreadIdNull ? null : action.payload.id,
          messages: []
        })
      };
    }
    case THREAD_GET_MESSAGE_LIST(PENDING):
      return {...state, ...stateGenerator(PENDING)};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(PENDING):
      return {...state, ...stateGenerator(SUCCESS, [], "messages")};
    case THREAD_GET_MESSAGE_LIST_BY_MESSAGE_ID(SUCCESS):
    case THREAD_GET_MESSAGE_LIST(SUCCESS): {
      const {threadId, messages} = action.payload;
      if (state.threadId) {
        if (threadId !== state.threadId) {
          return state;
        }
      }
      const object = {
        hasPrevious,
        hasNext,
        threadId,
        messages
      };
      return sortMessages(removeDuplicateMessages({...state, ...stateGenerator(SUCCESS, object)}));
    }

    case THREAD_GET_MESSAGE_LIST(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
    case THREAD_FILE_UPLOADING: {
      const messages = updateStore(state.messages, action.payload, {
        method: listUpdateStrategyMethods.UPDATE,
        mix: true,
        by: "uniqueId"
      });
      return removeDuplicateMessages({...state, ...stateGenerator(SUCCESS, messages, "messages")});
    }
    case THREAD_GET_MESSAGE_LIST_PARTIAL(SUCCESS): {
      const object = {
        hasPrevious,
        hasNext,
        threadId: action.payload.threadId,
        messages: [...action.payload.messages, ...state.messages]
      };
      return sortMessages(removeDuplicateMessages({...state, ...stateGenerator(SUCCESS, object)}));
    }
    case MESSAGE_SENDING_ERROR: {
      const messages = updateStore(state.messages, {
        hasError: true,
        id: action.payload.id
      }, {method: listUpdateStrategyMethods.UPDATE, mix: true, by: "id"});
      return removeDuplicateMessages({...state, ...stateGenerator(SUCCESS, messages, "messages")});
    }
    case MESSAGE_FILE_UPLOAD_CANCEL(SUCCESS):
      return {
        ...state, ...stateGenerator(SUCCESS, updateStore(state.messages, action.payload.uniqueId, {
          method: listUpdateStrategyMethods.REMOVE,
          by: "uniqueId"
        }), "messages")
      };
    case THREAD_NEW_MESSAGE:
      if (!checkForCurrentThread()) {
        return state;
      }
      return sortMessages({
        ...state,
        messages: updateStore(state.messages, action.payload, {
          method: listUpdateStrategyMethods.UPDATE,
          upsert: true,
          by: ["id", "uniqueId"],
          or: true
        })
      });
    case MESSAGE_EDIT():
      return {
        ...state, ...stateGenerator(SUCCESS, updateStore(state.messages, action.payload, {
          method: listUpdateStrategyMethods.UPDATE,
          by: "id"
        }), "messages")
      };
    case MESSAGE_SEEN():
      return {
        ...state, ...stateGenerator(SUCCESS, updateStore(state.messages, {
          seen: true,
          uniqueId: action.payload.uniqueId
        }, {method: listUpdateStrategyMethods.UPDATE, by: "uniqueId", mix: true}), "messages")
      };
    case MESSAGE_DELETE:
    case MESSAGE_CANCEL(SUCCESS):
      return {
        ...state,
        messages: updateStore(state.messages, action.payload, {
          method: listUpdateStrategyMethods.REMOVE,
          by: ["id", "uniqueId"],
          or: true
        })
      };
    default:
      return state;
  }
};


export const threadCheckedMessageListReducer = (state = [], action) => {
  switch (action.type) {
    case THREAD_CHECKED_MESSAGE_LIST_EMPTY:
      return [];
    case THREAD_CHECKED_MESSAGE_LIST_ADD:
      return updateStore(state, action.payload, {
        method: listUpdateStrategyMethods.UPDATE,
        by: "uniqueId",
        upsert: true
      }).sort((a, b) => a.time - b.time);
    case THREAD_CHECKED_MESSAGE_LIST_REMOVE:
      return updateStore(state, action.payload.uniqueId, {method: "REMOVE", by: "uniqueId"});
    default:
      return state;
  }
};

export const threadParticipantListReducer = (state = {
  participants: [],
  threadId: null,
  fetching: false,
  fetched: false,
  error: false
}, action) => {
  switch (action.type) {
    case THREAD_PARTICIPANT_GET_LIST(PENDING):
      return {...state, ...stateGenerator(PENDING, {participants: state.participants})};
    case THREAD_PARTICIPANTS_LIST_CHANGE:
    case THREAD_PARTICIPANT_GET_LIST(SUCCESS):

      if (action.type === THREAD_PARTICIPANTS_LIST_CHANGE) {
        if (state.threadId !== action.payload.threadId) {
          return state;
        }
      }
      return {
        ...state, ...stateGenerator(SUCCESS, {
          threadId: action.payload.threadId,
          participants: action.payload.participants
        })
      };
    case THREAD_PARTICIPANTS_REMOVED:
    case THREAD_LEAVE_PARTICIPANT:
      return {
        ...state, ...stateGenerator(SUCCESS, {
          participants: updateStore(state.participants, action.payload, {
            method: listUpdateStrategyMethods.REMOVE,
            by: ["id", "threadId"]
          })
        })
      };
    case THREAD_PARTICIPANT_GET_LIST(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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
    case THREAD_NOTIFICATION(PENDING):
      return {...state, ...stateGenerator(PENDING)};
    case THREAD_NOTIFICATION(SUCCESS):
      return {...state, ...stateGenerator(SUCCESS, action.payload, "threadId")};
    case THREAD_NOTIFICATION(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
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
    case THREAD_PARTICIPANT_ADD(PENDING):
      return {...state, ...stateGenerator(PENDING, null, "thread")};
    case THREAD_PARTICIPANT_ADD(SUCCESS): {
      let thread = action.payload;
      thread.timestamp = Date.now();
      return {...state, ...stateGenerator(SUCCESS, thread, "thread")};
    }
    case THREAD_PARTICIPANT_ADD(ERROR):
      return {...state, ...stateGenerator(ERROR, action.payload)};
    default:
      return state;
  }
};