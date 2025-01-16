import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
    user: {
        _id: string, 
        email:string,
    } | null,
    isAuthenticated: boolean
}

const initialState : IUserState = {
    isAuthenticated: false,
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loggedIn(state, action: PayloadAction<{user:{_id: string, email: string}}>){
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout(state){
            state.user = null;
            state.isAuthenticated = false;
        }
    }
})

export default userSlice.reducer;

export const {loggedIn, logout} = userSlice.actions