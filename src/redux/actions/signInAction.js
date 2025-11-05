export const SIGN_IN = "SIGN_IN_SUCCESS";
export const signIn = (email, password) => {
  return async (dispatch) => {
    await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",

        //     Authorization:
        //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NjEwNTM5MDUsImV4cCI6MTc2MjM0OTkwNSwic3ViIjoiYjVkMTQ0N2QtODhhMC00YmU0LWE4MDMtZDk0M2E4MTNiNjBmIn0.-SiX6rgwzcixSsDkgiRPOQDFCugu8a-wensvpAIKB1M",
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
          type: SIGN_IN,
          payload: data,
        });
      })
      .catch((err) => {
        alert("Errore nel login");
        console.log(err);
      });
  };
};
//CONTROLLARE BENE TUTTO!
