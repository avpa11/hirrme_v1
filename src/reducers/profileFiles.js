const INITIAL_STATE = {
    files: null,
  };

  const applySetFiles = (state, action) => ({
    ...state,
    files: action.files,
  });
  function filesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'FILES_SET': {
        return applySetFiles(state, action);
      }
      default:
        return state;
    }
  }
  export default filesReducer;