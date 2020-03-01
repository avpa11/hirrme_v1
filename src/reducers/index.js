import { combineReducers } from 'redux';
import sessionReducer from './session';
import usersReducer from './users';
import userReducer from './user';
import educationReducer from './education';
import experienceReducer from './experience';
import companyReducer from './company';
import likedUsersReducer from './likedUsers';
import savedVacanciesReducer from './savedVacancies'
import vacanciesReducer from './vacancies'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  // list of users / job seekers
  usersState: usersReducer,
  // single logged in user
  userState: userReducer,
  educationState: educationReducer,
  experienceState: experienceReducer,
  companyState: companyReducer,
  likedUsersState: likedUsersReducer,
  savedVacanciesState: savedVacanciesReducer,
  vacanciesState: vacanciesReducer
});
export default rootReducer;