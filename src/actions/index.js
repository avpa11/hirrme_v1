export const setEmail = (userEmail) => {
    return{
        type: 'SetUserEmail',
        payload: userEmail
    }
}