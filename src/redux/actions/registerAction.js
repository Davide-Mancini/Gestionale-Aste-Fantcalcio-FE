export const REGISTER = "REGISTER";
export const FAILED = "FAILED";
export const register = (nome, cognome, username, email, password) => {
  return async (dispatch) => {
    await fetch("http://localhost:3001/auth/registrazione", {
      method: "POST",
      body: JSON.stringify({ nome, cognome, username, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorePayload) => {
            const messaggioErrore =
              errorePayload.messaggio || "Errore nella registrazione";
            throw new Error(messaggioErrore);
          });
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: REGISTER,
          payload: data,
        });
      })
      .catch((err) => {
        dispatch({
          type: FAILED,
          payload: err.message,
        });
        console.log(err);
      });
  };
};
