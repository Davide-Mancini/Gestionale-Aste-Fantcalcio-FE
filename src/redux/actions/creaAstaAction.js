export const CREA_ASTA = "CREA_ASTA";

export const creaAstaAction = (nome, partecipanti, crediti, navigate) => {
  return async (dispatch) => {
    await fetch("rich-del-davide-mancini-9aa8ac64.koyeb.app/sessioniAsta", {
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
        console.log(data.id);
        navigate(`/sessioniAsta/${data.id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
