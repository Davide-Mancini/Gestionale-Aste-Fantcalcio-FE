export const GET_CALCIATORI = "GET_CALCIATORI";
export const getAllCalciatoriAction = (filters = {}) => {
  return async (dispatch) => {
    const params = new URLSearchParams(filters);
    await fetch(`http://localhost:3001/calciatori/search?${params.toString()}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel recupero dei calciatori");
        }
      })
      .then((data) => {
        dispatch({
          type: GET_CALCIATORI,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
