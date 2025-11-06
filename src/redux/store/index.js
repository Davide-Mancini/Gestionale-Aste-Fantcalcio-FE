import { configureStore, combineReducers } from "@reduxjs/toolkit";
import newsReducer from "../reducers/newsReducer";
import signInReducer from "../reducers/signInReducer";
import { registerReducer } from "../reducers/registerReducer";
import { uploadImgReducer } from "../reducers/uploadImgReducer";
import { getCalciatoriReducer } from "../reducers/getCalciatoriReducer";
import { creaAstaReducer } from "../reducers/creaAstaReducer";

const combineReducer = combineReducers({
  news: newsReducer,
  signIn: signInReducer,
  register: registerReducer,
  uploader: uploadImgReducer,
  calciatori: getCalciatoriReducer,
  asta: creaAstaReducer,
});

const store = configureStore({
  reducer: combineReducer,
});
export default store;
