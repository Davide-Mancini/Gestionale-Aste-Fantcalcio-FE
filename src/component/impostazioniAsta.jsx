import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { creaAstaAction } from "../redux/actions/creaAstaAction";
import PillNav from "./PillNav/PillNav";
import "./AnimatedList/AnimatedList/AnimatedList";
import AnimatedList from "./AnimatedList/AnimatedList/AnimatedList";
import SignInButton from "./signInButton";
import RegisterButton from "./registerButton";
import AnimatedList2 from "./AnimatedList2/AnimatedList2";
const ImpostazioniAsta = () => {
  const dispatch = useDispatch();
  const [nAllenatori, setNAllenatori] = useState(0);
  const [nCrediti, setNCrediti] = useState(0);
  const [nome, setNome] = useState("");
  console.log(nAllenatori);
  console.log(nCrediti);
  console.log(nome);
  const navigate = useNavigate();
  const [listaStrategie, setListaStrategie] = useState([]);
  const [loadingStrategie, setLoadingStrategie] = useState(true);
  //METODO PER RECUPERARE TUTTE LE STRATEGIE DELLO SPECIFICO UTENTE E LE SALVO NELLO STATO LOCALE SOPRA
  const fetchAllStrategie = async () => {
    setLoadingStrategie(true);
    try {
      const response = await fetch("http://localhost:3001/strategie", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Errore nel recupero delle strategie.");
      }

      const data = await response.json();
      setListaStrategie(data);
    } catch (error) {
      console.error("Errore:", error);
    } finally {
      setLoadingStrategie(false);
    }
  };
  //AL PRIMO RENDER RECUPERO TUTTE LE STRATEGIE
  useEffect(() => {
    fetchAllStrategie();
  }, []);
  const user = useSelector((state) => state.signIn.user);
  const listaAste = user?.sessioni;

  return (
    <>
      <Container fluid className=" min-vh-100 p-5 mx-auto">
        <div className=" d-flex justify-content-center">
          <PillNav
            logo={"src/assets/fire.svg"}
            logoAlt="Company Logo"
            items={[
              { label: "ASTA", href: "/impostazioni-asta" },
              { label: "STRATEGIA", href: "/strategia" },
              { label: "CAMPETTO", href: "/campetto" },
              { label: "PROFILO", href: "#" },
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
        <Row className="  mt-5">
          <Col
            xs={12}
            md={3}
            className=" bg-warning rounded-3 mt-3 text-center"
          >
            {user ? (
              <>
                <h2 className=" text-center fw-bold text-dark ">
                  LE TUE STRATEGIE
                </h2>
                <h5 className=" text-light text-center">
                  Dai un'occhiata alle tue strategie
                </h5>
                <hr />

                {loadingStrategie ? (
                  <p>Caricamento strategie salvate...</p>
                ) : (
                  <AnimatedList2
                    items={listaStrategie}
                    onItemSelect={(item, index) => console.log(item, index)}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                  />
                )}
              </>
            ) : (
              <>
                <h2 className=" text-center fw-bold text-dark">
                  LE TUE STRATEGIE
                </h2>
                <h5 className=" text-light text-center">
                  Accedi per visualizzare tutte le tue strategie...
                </h5>
              </>
            )}
          </Col>
          {user ? (
            <Col xs={12} md={6} className=" bg-dark rounded-3 text-center">
              <h1
                className=" text-center fw-bolder text-warning"
                style={{ fontSize: "70px" }}
              >
                CREA NUOVA ASTA
              </h1>
              <hr />
              <Col xs={12} className=" my-4 text-light">
                <h2>Quanti Fanta Allenatori?</h2>
                <Form.Select
                  className=" w-25 select trasparente shadow-none border-0 text-warning px-0 text-center mx-auto"
                  onChange={(e) => {
                    setNAllenatori(e.target.value);
                  }}
                >
                  <option className=" rounded-3" value="6">
                    6
                  </option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                </Form.Select>
              </Col>
              <Col xs={12} className="text-light my-4">
                <h2>Quanti Fanta Milioni?</h2>
                <Form.Select
                  className=" w-25 select trasparente shadow-none border-0 text-warning px-0 text-center mx-auto "
                  onChange={(e) => {
                    setNCrediti(e.target.value);
                  }}
                >
                  <option value="250">250</option>
                  <option value="300">300</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                </Form.Select>
              </Col>
              <Col xs={12} className="text-light my-4">
                <h2>Nome Asta</h2>
                <Form.Control
                  id="colorPlaceholder"
                  placeholder="Nome Asta"
                  className="trasparente w-25  shadow-none border-0 text-warning text-center mx-auto"
                  type="text"
                  onChange={(e) => {
                    setNome(e.target.value);
                  }}
                ></Form.Control>
              </Col>

              <Button
                variant="warning"
                className=" border-3 mt-5 w-50 rounded-pill text-light fs-4 fw-bolder"
                onClick={() => {
                  dispatch(
                    creaAstaAction(nome, nAllenatori, nCrediti, navigate)
                  );
                }} /*onClick={()=>{chiamata post su tabella aste con stato di crediti e allenatori}}*/
              >
                Crea Asta
              </Button>
            </Col>
          ) : (
            <Col
              xs={12}
              md={6}
              className="text-center text-light bg-dark rounded-3"
            >
              <h1 className="fw-bolder text-warning">CREA NUOVA ASTA</h1>
              <hr />
              <h2 className="  ">Effettua login per creare una nuova asta</h2>
              <p>
                Per poter creare iniziare una nuova asta è necesssario essere
                registrati ed aver effettuato il login
              </p>
              <div className=" d-flex justify-content-center">
                <SignInButton />
                <RegisterButton />
              </div>
            </Col>
          )}
          <Col xs={12} md={3} className=" bg-warning rounded-3 mt-3">
            <h2 className=" text-center fw-bolder text-dark">LE TUE ASTE</h2>
            {listaAste ? (
              <>
                <h5 className=" text-light text-center">
                  Rivedi le tue aste o riprendile da dove le hai lasciate{" "}
                </h5>
                <hr />

                <AnimatedList
                  items={listaAste}
                  onItemSelect={(item, index) => console.log(item, index)}
                  showGradients={true}
                  enableArrowNavigation={true}
                  displayScrollbar={true}
                />
              </>
            ) : (
              <h5 className=" text-light text-center">
                Accedi per visualizzare lo storico delle tue aste...
              </h5>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default ImpostazioniAsta;
