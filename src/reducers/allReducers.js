// Import all reducers here. 
//For now there is userEmailReducer only so it is useless

import {combineReducers} from 'redux'
import userEmailReducer from './userEmail'
// other reducers

const allReducers = combineReducers({
    userEmailReducer
    //, other reducer 
    // ...
});

export default allReducers;