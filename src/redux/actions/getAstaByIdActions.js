export const GET_ASTA_BY_ID = "GET_ASTA_BY_ID";
export const GetAstaByIdAction = (id) => {
  return async (dispatch) => {
    await fetch(`rich-del-davide-mancini-9aa8ac64.koyeb.app/sessioniAsta/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel recupero dell'asta");
        }
      })
      .then((data) => {
        console.log(data);
        dispatch({
          type: GET_ASTA_BY_ID,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
