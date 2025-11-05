import { SIGN_OUT } from "../actions/logoutAction";
import { SIGN_IN } from "../actions/signInAction";

const initialState = {
  signIn: false,
  user: null,
};
const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        signIn: true,
        user: action.payload,
      };
    case SIGN_OUT:
      return {
        signIn: false,
        user: {},
      };
    default:
      return state;
  }
};
export default signInReducer;
