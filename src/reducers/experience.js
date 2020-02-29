const INITIAL_STATE = {
    experiences: null,
    limit: 5,
  };
  const applySetExperiences = (state, action) => ({
    ...state,
    experiences: action.experiences,
  });
  const applySetExperiencesLimit = (state, action) => ({
    ...state,
    limit: action.limit,
  });
  function experienceReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'MESSAGES_SET': {
        return applySetExperiences(state, action);
      }
      case 'MESSAGES_LIMIT_SET': {
        return applySetExperiencesLimit(state, action);
      }
      default:
        return state;
    }
  }
  export default experienceReducer;