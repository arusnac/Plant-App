import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: [
        { isLoggedIn: window.localStorage.getItem('userStatus') }
    ],
    username: '',
    imagePath: 'test',
    status: 'idle',
    error: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState: { value: initialState },
    reducers: {
        toggleStatus: (state, action) => {
            state.value.user[0].isLoggedIn = action.payload;
            console.log('PAYTLAOD:  ' + action.payload)
            console.log(state.value.user[0].isLoggedIn)
        },
        setImagePath: (state, action) => {
            state.value.imagePath = action.payload;
            console.log(state.value.imagePath)
        },
        setUsername: (state, action) => {
            state.value.username = action.payload;
        }
    }
});

export const { toggleStatus, setImagePath, setUsername } = userSlice.actions;
export default userSlice.reducer;