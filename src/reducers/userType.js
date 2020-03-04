const INITIAL_STATE = {
    userType: null,
  };
  const applySetUserType = (state, action) => ({
    ...state,
    userType: action.userType,
  });
  function userTypeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'USER_TYPE_SET': {
        return applySetUserType(state, action);
      }    
      default:
        return state;
    }
  }
  export default userTypeReducer;