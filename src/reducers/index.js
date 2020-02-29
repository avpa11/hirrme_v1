import { combineReducers } from 'redux';
import sessionReducer from './session';
import usersReducer from './users';
import userReducer from './user';
import educationReducer from './education';
import experienceReducer from './experience';
import companyReducer from './company';
const rootReducer = combineReducers({
  sessionState: sessionReducer,
  // list of users / job seekers
  usersState: usersReducer,
  // single logged in user
  userState: userReducer,
  educationState: educationReducer,
  experienceState: experienceReducer,
  companyState: companyReducer,
});
export default rootReducer;