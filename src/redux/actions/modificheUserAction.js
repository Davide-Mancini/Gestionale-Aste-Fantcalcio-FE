export const MODIFICA_UTENTE = "MODIFICA_UTENTE";
export const modificheUserAction = (id, nome, cognome, username, email) => {
  return async (dispatch) => {
    await fetch(`rich-del-davide-mancini-9aa8ac64.koyeb.app/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nome, cognome, username, email }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel login");
        }
      })
      .then((data) => {
        dispatch({
          type: MODIFICA_UTENTE,
          payload: data,
        });
      })
      .catch((err) => {
        alert("Errore nel login");
        console.log(err);
      });
  };
};
