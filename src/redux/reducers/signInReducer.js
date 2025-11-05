import { SIGN_OUT } from "../actions/logoutAction";
import { SIGN_IN } from "../actions/signInAction";

const initialState = {
  isAuthenticated: false,
  user: null,
};
const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case SIGN_OUT:
      return {
        isAuthenticated: false,
        user: {},
      };
    default:
      return state;
  }
};
export default signInReducer;
