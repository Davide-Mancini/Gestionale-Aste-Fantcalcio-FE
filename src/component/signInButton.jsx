import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { signIn } from "../redux/actions/signInAction";
import { useDispatch, useSelector } from "react-redux";
const SignInButton = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  //FETCH PER RECUPERARE LE NOTIZIE
  // useEffect(() => {
  //   dispatch(signIn());
  // }, []);
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
  return (
    <>
      <Button
        variant="outline-dark"
        className=" me-1 mt-1 border-3"
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleSignIn} type="submit">
            Accedi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SignInButton;
