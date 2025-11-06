export const CREA_ASTA = "CREA_ASTA";

export const creaAstaAction = (nome, partecipanti, crediti) => {
  return async (dispatch) => {
    await fetch("http://localhost:3001/sessioniAsta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomeAsta: nome,
        numPartecipanti: partecipanti,
        crediti: crediti,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nella creazione dell'asta");
        }
      })
      .then((data) => {
        dispatch({
          type: CREA_ASTA,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
