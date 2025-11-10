import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MyNavbar from "./myNavbar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { creaAstaAction } from "../redux/actions/creaAstaAction";

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
      <MyNavbar />
      <Container className=" p-5 m-5">
        <Row>
          <Col xs={12} md={8}>
            <h1 className=" text-center fw-bolder text-black">
              CREA NUOVA ASTA
            </h1>
            <hr />
            <Col xs={12}>
              <h2 className=" text-center">Quanti Fanta Allenatori?</h2>
              <Form.Select
                onChange={(e) => {
                  setNAllenatori(e.target.value);
                }}
              >
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
              </Form.Select>
            </Col>
            <Col xs={12}>
              <h2 className=" text-center">Quanti Fanta Milioni?</h2>
              <Form.Select
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
            <Col xs={12}>
              <h2>Nome Asta</h2>
              <Form.Control
                type="text"
                onChange={(e) => {
                  setNome(e.target.value);
                }}
              ></Form.Control>
            </Col>

            <Button
              variant="outline-success"
              className=" border-3 mt-5 w-100"
              onClick={() => {
                dispatch(creaAstaAction(nome, nAllenatori, nCrediti, navigate));
              }} /*onClick={()=>{chiamata post su tabella aste con stato di crediti e allenatori}}*/
            >
              Crea Asta
            </Button>
          </Col>
          <Col xs={12} md={4}>
            <h1 className=" text-center fw-bolder text-black">ACCEDI ASTE</h1>
            <hr />
            {listaAste ? (
              <ul className="text-center">
                {listaAste?.map((asta, index) => (
                  <a
                    href={`http://localhost:5173/sessioniAsta/${asta.id}`}
                    key={index}
                  >
                    <li key={index}>{asta.nome_asta}</li>
                  </a>
                ))}
              </ul>
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
