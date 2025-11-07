import { GET_ASTA_BY_ID } from "../actions/getAstaByIdActions";

const initialState = {
  asta: {},
};
export const getAstaByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ASTA_BY_ID:
      return {
        ...state,
        asta: action.payload,
      };
    default:
      return state;
  }
};
