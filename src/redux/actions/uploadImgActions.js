export const UPLOAD = "UPLOAD";
export const uploadImg = (file) => {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append("avatar", file);
    await fetch("http://localhost:3001/users/me/avatar", {
      method: "PATCH",
      body: formData,

      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore nel caricamento file");
        }
      })
      .then((data) => {
        dispatch({
          type: UPLOAD,
          payload: data.avatar,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
