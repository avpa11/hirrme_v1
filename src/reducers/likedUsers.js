const INITIAL_STATE = {
    likedUsers: null,
  };
  const applySetLikedUsers = (state, action) => ({
    ...state,
    likedUsers: action.likedUsers
  });
  function likedUsersReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'LIKED_USERS_SET': {
        return applySetLikedUsers(state, action);
      }
      default:
        return state;
    }
  }
  export default likedUsersReducer;