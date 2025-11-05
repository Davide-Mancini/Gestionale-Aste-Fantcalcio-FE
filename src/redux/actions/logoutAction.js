export const SIGN_OUT = "SIGN_OUT";
export const Logout = () => {
  return async (dispatch) => {
    fetch("http://localhost:3001/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.text().then((testo) => {
            return testo ? JSON.parse(testo) : {};
          });
        } else {
          throw new Error("Errore nel logout");
        }
      })
      .then((data) => {
        dispatch({
          type: SIGN_OUT,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
