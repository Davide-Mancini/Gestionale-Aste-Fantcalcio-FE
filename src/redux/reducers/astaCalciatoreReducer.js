import { ASTA_CALCIATORE } from "../actions/astaCalciatoreAction";

const initialState = {
  asta: {},
};
export const astaCalciatoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case ASTA_CALCIATORE:
      return {
        ...state,
        asta: action.payload,
      };
    default:
      return state;
  }
};
