export const GET_CALCIATORI = "GET_CALCIATORI";
export const getAllCalciatoriAction = (filters = {}) => {
  return async (dispatch) => {
    const params = new URLSearchParams(filters);
    await fetch(
      `rich-del-davide-mancini-9aa8ac64.koyeb.app/calciatori/search?${params.toString()}`
    )
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
