import {
  HIDE_PROFILE_MODAL,
  SHOW_PROFILE_MODAL,
} from "../actions/modaleProfiloAction";

const initialState = {
  showProfileModal: false,
};

const modaleProfiloReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PROFILE_MODAL:
      return {
        ...state,
        showProfileModal: true,
      };
    case HIDE_PROFILE_MODAL:
      return {
        ...state,
        showProfileModal: false,
      };
    default:
      return state;
  }
};
export default modaleProfiloReducer;
