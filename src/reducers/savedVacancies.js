const INITIAL_STATE = {
    savedVacancies: null,
  };
  const applySetSavedVacancies = (state, action) => ({
    ...state,
    savedVacancies: action.savedVacancies
  });
  function savedVacanciesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'SAVED_VACANCIES_SET': {
        return applySetSavedVacancies(state, action);
      }
      default:
        return state;
    }
  }
  export default savedVacanciesReducer;