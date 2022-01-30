import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: 0 }

const coursesSlice = createSlice({
    name: 'courses',
    initialState, 
    reducers: {
        addCourses(state, action) {
            state.value++;
        }
    }
})

export default coursesSlice.reducer