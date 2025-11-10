export const ADD_UTENTE_TO_ASTA = "ADD_UTENTE_TO_ASTA";

export const addUserToAstaAction = (astaId, utenteId) => {
  return async (dispatch) => {
    await fetch(
      `http://localhost:3001/sessioniAsta/aggiungi-utente?idAsta=${astaId}&idUtente=${utenteId}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel salvataggio utente ad asta");
        }
      })
      .then((data) => {
        dispatch({
          type: ADD_UTENTE_TO_ASTA,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
