const INITIAL_STATE = {
    appliedVacancies: null,
  };
  const applySetAppliedVacancies = (state, action) => ({
    ...state,
    appliedVacancies: action.appliedVacancies
  });
  function appliedVacanciesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'APPLIED_VACANCIES_SET': {
        return applySetAppliedVacancies(state, action);
      }
      default:
        return state;
    }
  }
  export default appliedVacanciesReducer;