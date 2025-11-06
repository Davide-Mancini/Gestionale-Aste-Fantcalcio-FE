import { GET_CALCIATORI } from "../actions/getAllCalciatori";

const initialState = {
  calciatori: [],
};
export const getCalciatoriReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CALCIATORI:
      return {
        ...state,
        calciatori: action.payload.content,
      };
    default:
      return state;
  }
};
