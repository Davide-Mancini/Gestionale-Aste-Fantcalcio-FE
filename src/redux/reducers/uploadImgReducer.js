import { UPLOAD } from "../actions/uploadImgActions";

const initialState = {
  url: null,
};
export const uploadImgReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD:
      return {
        ...state,
        url: action.payload,
      };
    default:
      return state;
  }
};
