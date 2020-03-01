const INITIAL_STATE = {
    vacancies: null,
  };
  const applySetVacancies = (state, action) => ({
    ...state,
    vacancies: action.vacancies,
  });
//   const applySetUser = (state, action) => ({
//     ...state,
//     users: {
//       ...state.users,
//       [action.uid]: action.user,
//     },
//   });
  function vacanciesReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'VACANCIES_SET': {
        return applySetVacancies(state, action);
      }      
      default:
        return state;
    }
  }
  export default vacanciesReducer;