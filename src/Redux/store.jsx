import {  combineReducers, configureStore } from '@reduxjs/toolkit'
import LoadingReducer from './reducers/LoadingReducer'

const reducer = combineReducers({
    LoadingReducer,
})

const store = configureStore({ reducer });

export default store