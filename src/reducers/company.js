const INITIAL_STATE = {
    companies: null,
  };
  const applySetCompanies = (state, action) => ({
    ...state,
    companies: action.companies,
  });
  const applySetCompany = (state, action) => ({
    ...state,
    companies: {
      ...state.companies,
      [action.key]: action.company,
    },
  });
  function companyReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'COMPANIES_SET': {
        return applySetCompanies(state, action);
      }
      case 'COMPANY_SET': {
        return applySetCompany(state, action);
      }
      default:
        return state;
    }
  }
  export default companyReducer;