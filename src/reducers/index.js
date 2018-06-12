import contactReducer from './contactReducer';
import threadReducer from './threadReducer';
import messageReducer from './messageReducer';

const rootReducer = {
  contact: contactReducer,
  thread: threadReducer,
  message: messageReducer,
};

export default rootReducer;