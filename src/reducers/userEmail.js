const userEmailReducer = (state = "", action) => {
    switch(action.type){
        case 'SetUserEmail':
            return state = action.payload
        default:
                return state;
    }
}

export default userEmailReducer;