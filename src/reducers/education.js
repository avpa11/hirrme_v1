const INITIAL_STATE = {
    educations: null,
    limit: 5,
  };
  const applySetEducations = (state, action) => ({
    ...state,
    educations: action.educations,
  });
  const applySetEducationsLimit = (state, action) => ({
    ...state,
    limit: action.limit,
  });
  function educationReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'EDUCATIONS_SET': {
        return applySetEducations(state, action);
      }
      case 'EDUCATIONS_LIMIT_SET': {
        return applySetEducationsLimit(state, action);
      }
      default:
        return state;
    }
  }
  export default educationReducer;