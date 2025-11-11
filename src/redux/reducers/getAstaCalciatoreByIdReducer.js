import { GET_ASTA_CALCIATORE_BY_ID } from "../actions/getAstaCalciatoreByid";

const initialState = {
  asta: {},
};
export const getAstaCalciatoreByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASTA_CALCIATORE_BY_ID:
      return {
        ...state,
        asta: action.payload,
      };
    default:
      return state;
  }
};
