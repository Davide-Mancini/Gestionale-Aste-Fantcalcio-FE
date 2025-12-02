import { SIGN_IN } from "./signInAction";

export const CHECK_AUTH = "CHECK_AUTH";

export const checkAuth = () => {
  return async (dispatch) => {
    fetch("rich-del-davide-mancini-9aa8ac64.koyeb.app/auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel recupero dell'utente");
        }
      })
      .then((data) => {
        console.log(data);
        dispatch({
          type: SIGN_IN,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
