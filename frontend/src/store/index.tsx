import { configureStore } from '@reduxjs/toolkit';
import coursesReducer from './courses';


const store = configureStore({
    reducer: {
        courses: coursesReducer
    }
});

export default store;