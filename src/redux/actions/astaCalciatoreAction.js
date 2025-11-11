export const ASTA_CALCIATORE = "ASTA_CALCIATORE";
export const astaCalciatoreAction = (calciatore, asta) => {
  return async (dispatch) => {
    await fetch("http://localhost:3001/astacalciatore/nuova-asta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        calciatore: calciatore,
        asta: asta,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nella creazione asta per calciatore");
        }
      })
      .then((data) => {
        dispatch({
          type: ASTA_CALCIATORE,
          payload: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
