import { Check, CheckLg, Fire, PencilFill } from "react-bootstrap-icons";
import HeroSection from "./heroSection";
import Mycarousel from "./myCarousel";
import MyFooter from "./myFooter";
import PillNav from "./PillNav/PillNav";
import Steps from "./steps";
import RegisterButton from "./registerButton";
import SignInButton from "./signInButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Logout } from "../redux/actions/logoutAction";
import {
  Alert,
  Button,
  DropdownButton,
  Form,
  Modal,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../style/homePage.css";
import { uploadImg } from "../redux/actions/uploadImgActions";
import { modificheUserAction } from "../redux/actions/modificheUserAction";
import { resetLoginSuccess } from "../redux/actions/signInAction";
const HomePage = () => {
  const dispatch = useDispatch();
  // const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //RECUPERO USER
  const user = useSelector((state) => {
    return state.signIn.user;
  });
  //SERVONO PER INVIARE LE MODIFCHE DEL PROFILO
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  //SE USER è PRESENTE SETTO GLI STATI LOCALI CON I DATI REALI
  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setCognome(user.cognome || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
    }
  }, [user]);
  //FUNZIONE CHE DISPATCHA L'ACTION DI MODIFICA
  const [effettuate, setEffettuate] = useState(false);
  const handleModifiche = () => {
    dispatch(modificheUserAction(user.id, nome, cognome, username, email));
    setEffettuate(true);
    setTimeout(() => {
      handleClose();
      setEffettuate(false);
    }, 2000);
  };
  const signInState = useSelector((state) => {
    return state.signIn.isAuthenticated;
  });
  const loginSuccesso = useSelector((state) => {
    return state.signIn.loginSuccess;
  });
  useEffect(() => {
    if (loginSuccesso) {
      // setVisible(true);
      const timer = setTimeout(() => {
        dispatch(resetLoginSuccess());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccesso, dispatch]);
  //PER AGGIORNARE IMMAGINE
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadImg(file));
    }
  };
  const urlUploaded = useSelector((state) => state.uploader.url);
  const imageSrc = urlUploaded || user?.avatar;
  const [modificaPassword, setModificaPassword] = useState(false);
  const handleModificaPassword = () => {
    setModificaPassword(true);
    setTimeout(() => {
      setModificaPassword(false);
    }, 60000);
  };
  return (
    <>
      <div className=" d-flex justify-content-center">
        {/* NAVBAR DI REACT BITS */}
        <PillNav
          logo={"/fire.svg"}
          logoAlt="Company Logo"
          items={[
            { label: "ASTA", href: "/impostazioni-asta" },
            { label: "STRATEGIA", href: "/strategia" },
            { label: "NOTIZIE", href: "/campetto" },
            { label: "PROFILO", href: "#", onClick: handleShow },
          ]}
          activeHref="/"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#dda60eff"
          pillColor="#212529"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#fcf9f9ff"
        />
      </div>
      {/* SE UTENTE NON è LOGGATO MOSTRO I BOTTONI DI ACCESSO E REGISTRAZIONE ALTRIMENTI BOTTONE CON NOME */}
      {!signInState ? (
        <div className="d-flex flex-row-reverse">
          <RegisterButton />
          <SignInButton />
        </div>
      ) : (
        <>
          {loginSuccesso && signInState && (
            <Alert
              variant="warning"
              className=" position-fixed start-50 text-center z-3 translate-middle fw-bold  mt-5 "
              style={{ top: "3em" }}
            >
              Login effettuato
              <CheckLg className=" ms-1 fs-5 text-success" />
            </Alert>
          )}
          <div className="d-flex flex-row-reverse me-5  ">
            <DropdownButton
              variant="warning"
              className="text-center me-1 mt-3   "
              title={
                <h6 className=" text-light m-0">
                  Ciao, <span className=" fw-bold"> {user?.nome || "..."}</span>
                </h6>
              }
              drop="start"
              // showCaret={false}
            >
              <Link className=" dropdown-item" onClick={handleShow}>
                Profilo
              </Link>

              <NavDropdown.Item href="#action/3.1">
                Termini e Condizioni
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <Link
                to={"/"}
                className=" dropdown-item logout text-center"
                onClick={() => {
                  dispatch(Logout());
                }}
              >
                {" "}
                Logout
              </Link>
            </DropdownButton>
          </div>
        </>
      )}
      {user ? (
        <>
          {show && (
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Profilo</Modal.Title>
              </Modal.Header>
              {!effettuate ? (
                <Modal.Body>
                  {" "}
                  <div className=" w-100 text-center ">
                    <img src={imageSrc} alt="" className=" w-50 rounded-4" />
                    <Form.Group controlId="formFile" className="mb-3 ">
                      <Form.Control
                        type="file"
                        onChange={handleUpload}
                        className="file-upload w-50 mx-auto"
                      />
                    </Form.Group>
                  </div>
                  <p className=" m-0 ">Nome</p>
                  <Form.Control
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                    }}
                  ></Form.Control>
                  <p className=" m-0">Cognome</p>
                  <Form.Control
                    value={cognome}
                    onChange={(e) => {
                      setCognome(e.target.value);
                    }}
                  ></Form.Control>
                  <p className=" m-0">Username</p>
                  <Form.Control
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  ></Form.Control>
                  <p className=" m-0">Email</p>
                  <Form.Control
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></Form.Control>
                  {!modificaPassword ? (
                    <small
                      className=" text-decoration-underline"
                      style={{ cursor: "pointer" }}
                      onClick={handleModificaPassword}
                    >
                      Modifica Password
                    </small>
                  ) : (
                    <>
                      <p className=" m-0">Vecchia Password</p>
                      <Form.Control></Form.Control>
                      <p className=" m-0">Nuova Password</p>
                      <Form.Control></Form.Control>
                      <p className=" m-0">Ripeti Nuova Password</p>
                      <Form.Control></Form.Control>
                    </>
                  )}
                </Modal.Body>
              ) : (
                <Modal.Body>
                  <div>
                    <h5>Modifiche effettuate con successo!</h5>
                  </div>
                </Modal.Body>
              )}

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
                  onClick={handleModifiche}
                >
                  Salva Modifiche
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      ) : (
        <>
          {show && (
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Profilo</Modal.Title>
              </Modal.Header>
              <Modal.Body className=" text-center">
                <h3>
                  Per visualizzare i dati del profilo devi prima effettuare
                  l'accesso
                </h3>
                <SignInButton />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className=" rounded-pill border-2 fw-bold"
                  variant="outline-danger"
                  onClick={handleClose}
                >
                  Chiudi
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </>
      )}

      <HeroSection />
      <Steps />
      <Mycarousel />
      <MyFooter />
    </>
  );
};
export default HomePage;
