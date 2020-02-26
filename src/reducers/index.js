import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import educationReducer from './education';
import experienceReducer from './experience';
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  educationState: educationReducer,
  experienceState: experienceReducer,
});
export default rootReducer;