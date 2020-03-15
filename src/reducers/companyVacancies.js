const INITIAL_STATE = {
    companyVacancies: null,
  };
  const applySetCompanyVacancies = (state, action) => ({
    ...state,
    companyVacancies: action.companyVacancies
  });
  function companyVacanciesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'COMPANY_VACANCIES_SET': {
        return applySetCompanyVacancies(state, action);
      }
      default:
        return state;
    }
  }
  export default companyVacanciesReducer;