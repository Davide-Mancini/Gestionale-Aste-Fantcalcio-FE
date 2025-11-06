import "../style/navbar.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import SignInButton from "./signInButton";
import RegisterButton from "./registerButton";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PersonCircle } from "react-bootstrap-icons";
import { Alert, Toast, ToastContainer } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Logout } from "../redux/actions/logoutAction";

function MyNavbar() {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const user = useSelector((state) => {
    return state.signIn.user;
  });

  const signInState = useSelector((state) => {
    return state.signIn.isAuthenticated;
  });
  useEffect(() => {
    if (signInState) {
      setVisible(true);
      const timer = setTimeout(() => {
        return setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [signInState]);
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary fw-medium "
      fixed="top"
    >
      <Container fluid className=" m-0">
        <Link to={"/"} className=" navbar-brand ms-4">
          {" "}
          Algo Tool Asta
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto d-flex w-50 justify-content-evenly  ">
            <Link to={"/impostazioni-asta"} className=" nav-link">
              Asta
            </Link>
            <Link to={"/strategia"} className=" nav-link">
              Strategia
            </Link>
            <Nav.Link href="#pricing">Campetto</Nav.Link>
            <NavDropdown title="Lista Giocatori" id="collapsible-nav-dropdown">
              <Link to={"/listacalciatori"} className=" dropdown-item">
                Lista Completa
              </Link>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">Portieri</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">Difensori</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Centrocampisti
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Attaccanti</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#pricing">Contatti</Nav.Link>
          </Nav>
          <Nav className=" me-4">
            {!signInState ? (
              <>
                <SignInButton />
                <RegisterButton />
              </>
            ) : (
              <>
                <div>
                  {visible && (
                    <Alert
                      variant="success"
                      className=" position-fixed start-50 text-center z-3 translate-middle shadow mt-5"
                    >
                      Login effettuato
                    </Alert>
                  )}

                  <DropdownButton
                    className=" text-center me-3 "
                    title={
                      <h6>
                        Ciao,{" "}
                        <span className=" fw-bold"> {user?.nome || "..."}</span>
                      </h6>
                    }
                    drop="start"
                    showCaret={false}
                  >
                    <Link className=" dropdown-item" to={"/profile"}>
                      Profilo
                    </Link>

                    <NavDropdown.Item href="#action/3.1">
                      Termini e Condizioni
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      className="logout text-center "
                      onClick={() => {
                        dispatch(Logout());
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </DropdownButton>
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
