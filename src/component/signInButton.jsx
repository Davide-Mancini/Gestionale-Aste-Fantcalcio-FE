import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { signIn } from "../redux/actions/signInAction";
import { useDispatch, useSelector } from "react-redux";
import "../style/SignInButton.css";
const SignInButton = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleSignIn = () => {
    dispatch(signIn(email, password));
  };
  const signInState = useSelector((state) => state.signIn.isAuthenticated);

  useEffect(() => {
    if (signInState) {
      setShow(false);
    }
  }, [signInState]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [passwordDimenticata, setPasswordDimenticata] = useState(false);
  const handlePasswordDimenticata = () => {
    setPasswordDimenticata(true);
    setTimeout(() => {
      setPasswordDimenticata(false);
    }, 30000);
  };
  const [mailInviata, setMailInviata] = useState(false);
  return (
    <>
      <Button
        variant="warning"
        className=" me-1 mt-3 border-3 rounded-pill fw-bold text-light"
        onClick={handleShow}
      >
        Accedi
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Accedi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="campo-email mb-3 shadow-none"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                rows={3}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            {!passwordDimenticata ? (
              <small
                className=" text-decoration-underline"
                style={{ cursor: "pointer" }}
                onClick={handlePasswordDimenticata}
              >
                Password dimenticata?
              </small>
            ) : (
              <>
                {!mailInviata ? (
                  <>
                    <p>Inserisci email di recupero</p>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" autoFocus />
                    <div className=" d-flex justify-content-end">
                      <Button
                        className=" rounded-pill  mt-2"
                        onClick={() => {
                          setMailInviata(true);
                        }}
                      >
                        Invia mail
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>
                    Inviata! Segui le istruzioni nella mail per il recupero
                    della password{" "}
                  </p>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className=" rounded-pill border-2 fw-bold"
            variant="outline-danger"
            onClick={handleClose}
          >
            Chiudi
          </Button>
          <Button
            className=" text-light fw-bold rounded-pill"
            variant="warning"
            onClick={() => {
              handleSignIn();
            }}
            type="submit"
          >
            Accedi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SignInButton;
