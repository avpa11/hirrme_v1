const INITIAL_STATE = {
    loggedCompany: null,
  };

  const applySetLoggedCompany = (state, action) => ({
    ...state,
    loggedCompany: {
      ...state.loggedCompany,
      [action.key]: action.loggedCompany,
    },
  });
  const applyDeleteLoggedCompany = (state, action) => ({
    ...state,
    loggedCompany: null
  })
  function loggedCompanyReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'LOGGED_COMPANY_SET': {
        return applySetLoggedCompany(state, action);
      }
      case 'LOGGED_COMPANY_DELETE': {
        return applyDeleteLoggedCompany(state, action);
      }
      default:
        return state;
    }
  }
  export default loggedCompanyReducer;