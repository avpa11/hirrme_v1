import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import educationReducer from './education';
import experienceReducer from './experience';
import likedUsersReducer from './likedUsers';
import savedVacanciesReducer from './savedVacancies'
import vacanciesReducer from './vacancies'

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  educationState: educationReducer,
  experienceState: experienceReducer,
  likedUsersState: likedUsersReducer,
  savedVacanciesState: savedVacanciesReducer,
  vacanciesState: vacanciesReducer
});
export default rootReducer;