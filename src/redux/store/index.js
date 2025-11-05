import { configureStore, combineReducers } from "@reduxjs/toolkit";
import newsReducer from "../reducers/newsReducer";
import signInReducer from "../reducers/signInReducer";
import { registerReducer } from "../reducers/registerReducer";
import { uploadImgReducer } from "../reducers/uploadImgReducer";

const combineReducer = combineReducers({
  news: newsReducer,
  signIn: signInReducer,
  register: registerReducer,
  uploader: uploadImgReducer,
});

const store = configureStore({
  reducer: combineReducer,
});
export default store;
