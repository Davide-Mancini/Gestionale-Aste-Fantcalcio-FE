import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./myNavbar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { creaAstaAction } from "../redux/actions/creaAstaAction";
import PillNav from "./PillNav/PillNav";
import "./AnimatedList/AnimatedList/AnimatedList";
import AnimatedList from "./AnimatedList/AnimatedList/AnimatedList";
const ImpostazioniAsta = () => {
  const dispatch = useDispatch();
  const [nAllenatori, setNAllenatori] = useState(0);
  const [nCrediti, setNCrediti] = useState(0);
  const [nome, setNome] = useState("");
  console.log(nAllenatori);
  console.log(nCrediti);
  console.log(nome);
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(creaAstaAction(nome, nAllenatori, nCrediti));
  // },[]);

  const user = useSelector((state) => state.signIn.user);
  const listaAste = user?.sessioni;

  return (
    <>
      <Container fluid className=" p-5 mx-auto">
        <div className=" d-flex justify-content-center">
          <PillNav
            logo={"src/assets/fire.svg"}
            logoAlt="Company Logo"
            items={[
              { label: "ASTA", href: "/impostazioni-asta" },
              { label: "STRATEGIA", href: "/strategia" },
              { label: "CAMPETTO", href: "/campetto" },
              { label: "PROFILO", href: "/profile" },
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
        <Row className=" mt-4">
          {user ? (
            <Col xs={12} md={8} className=" bg-dark rounded-3">
              <h1 className=" text-center fw-bolder text-warning">
                CREA NUOVA ASTA
              </h1>
              <hr />
              <Col xs={12} className=" my-4 text-warning">
                <h2>Quanti Fanta Allenatori?</h2>
                <Form.Select
                  className=" select trasparente shadow-none border-0 text-warning text-center"
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
              <Col xs={12} className="text-warning my-4">
                <h2>Quanti Fanta Milioni?</h2>
                <Form.Select
                  className=" select trasparente shadow-none border-0 text-warning text-center "
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
              <Col xs={12} className="text-warning my-4">
                <h2>Nome Asta</h2>
                <Form.Control
                  id="colorPlaceholder"
                  placeholder="Nome Asta"
                  className="trasparente  shadow-none border-0 text-warning text-center"
                  type="text"
                  onChange={(e) => {
                    setNome(e.target.value);
                  }}
                ></Form.Control>
              </Col>

              <Button
                variant="outline-warning"
                className=" border-3 mt-5 w-100"
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
            <Col xs={12} md={8} className=" bg-dark rounded-3">
              <h1 className=" text-center fw-bolder text-warning">
                CREA NUOVA ASTA
              </h1>
              <hr />
              <h2 className=" text-warning text-center">
                Effettua login per creare una nuova asta
              </h2>
            </Col>
          )}
          <Col xs={12} md={4} className=" bg-warning rounded-3">
            <h1 className=" text-center fw-bolder text-black">LE TUE ASTE</h1>
            <hr />
            {listaAste ? (
              <AnimatedList
                items={listaAste}
                onItemSelect={(item, index) => console.log(item, index)}
                showGradients={true}
                enableArrowNavigation={true}
                displayScrollbar={true}
              />
            ) : (
              <h2>Effettua login per accedere alle tue aste</h2>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default ImpostazioniAsta;
