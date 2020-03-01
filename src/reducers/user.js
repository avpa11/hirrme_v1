const INITIAL_STATE = {
    user: null,
  };

  const applySetUser = (state, action) => ({
    ...state,
    user: {
      ...state.users,
      [action.key]: action.user,
    },
  });
  function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'USER_SET': {
        return applySetUser(state, action);
      }
      default:
        return state;
    }
  }
  export default userReducer;