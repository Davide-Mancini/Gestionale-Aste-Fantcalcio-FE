import { configureStore, combineReducers } from "@reduxjs/toolkit";
import newsReducer from "../reducers/newsReducer";
import signInReducer from "../reducers/signInReducer";
import { registerReducer } from "../reducers/registerReducer";

const combineReducer = combineReducers({
  news: newsReducer,
  signIn: signInReducer,
  register: registerReducer,
});

const store = configureStore({
  reducer: combineReducer,
});
export default store;
