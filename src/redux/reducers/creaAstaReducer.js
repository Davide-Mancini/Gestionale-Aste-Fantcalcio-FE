import { CREA_ASTA } from "../actions/creaAstaAction";

const initialState = {
  asta: {},
};
export const creaAstaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREA_ASTA:
      return {
        ...state,
        asta: action.payload,
      };
    default:
      return state;
  }
};
