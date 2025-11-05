import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/actions/registerAction";

const RegisterButton = () => {
  //Stato per gestire l'alert
  const [showAlert, setShowAlert] = useState(false);
  //Stato per gestire il modale
  const [show, setShow] = useState(false);
  //Funzione per chiudere il modale
  const handleClose = () => {
    setShow(false);
  };
  //Funzione per aprire il modale
  const handleShow = () => {
    setShow(true);
  };
  //Stati da inserire nel payload per la registrazione
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  //Recupero lo stato della registrazione dallo stato redux
  const registerStatus = useSelector((state) => state.register.registrato);
  console.log(registerStatus);
  //Funzione per gestire la fetch di registrazione
  const handleRegister = () => {
    dispatch(register(nome, cognome, username, email, password));
  };
  //Recupero il messaggio di errore
  const errorMessage = useSelector((state) => state.register.error);
  console.log(errorMessage);
  //Use effect che quando avviene la registarzione con successo chiude il modale e fa apparire l'alert
  useEffect(() => {
    if (registerStatus && !errorMessage) {
      handleClose();
      setShowAlert(true);
      const timer = setTimeout(() => {
        return setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registerStatus, errorMessage]);
  return (
    <>
      {showAlert && (
        <Alert
          variant="success"
          className=" position-fixed start-50 text-center z-3 translate-middle shadow mt-5"
        >
          Registrazione completata!
        </Alert>
      )}

      <Button
        variant="outline-primary"
        className=" me-1 mt-1 border-3"
        onClick={handleShow}
      >
        Registrati
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Registrazione</Modal.Title>
        </Modal.Header>
        {errorMessage && (
          <Alert
            variant="danger"
            className=" position-fixed start-50 text-center z-3 translate-middle shadow mt-5"
          >
            {errorMessage}
          </Alert>
        )}
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required
                type="text"
                autoFocus
                onChange={(e) => {
                  setNome(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="cognome">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                required
                type="text"
                autoFocus
                onChange={(e) => {
                  setCognome(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                required
                type="text"
                autoFocus
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
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
          <Button variant="primary" type="submit" onClick={handleRegister}>
            Registrati
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default RegisterButton;
