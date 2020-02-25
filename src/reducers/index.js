import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import educationReducer from './education';
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  educationState: educationReducer,
});
export default rootReducer;