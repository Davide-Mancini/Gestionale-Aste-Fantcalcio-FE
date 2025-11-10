import { ADD_UTENTE_TO_ASTA } from "../actions/addUserToAstaAction";

const initialState = {
  response: null,
};
export const addUserToAstaReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_UTENTE_TO_ASTA:
      return {
        ...state,
        response: action.payload,
      };
    default:
      return state;
  }
};
