const INITIAL_STATE = {
    user: null,
  };

  const applySetUser = (state, action) => ({
    ...state,
    user: {
      ...state.user,
      [action.key]: action.user,
    },
  });
  const applyDeleteUser = (state, action) => ({
    ...state,
    user: null
  })
  function userReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'USER_SET': {
        return applySetUser(state, action);
      }
      case 'USER_DELETE': {
        return applyDeleteUser(state, action);
      }
      default:
        return state;
    }
  }
  export default userReducer;