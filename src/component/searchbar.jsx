import { Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import "../style/searchbar.css";
import { useEffect, useState } from "react";
import { HourglassSplit } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllCalciatoriAction } from "../redux/actions/getAllCalciatori";
import { astaCalciatoreAction } from "../redux/actions/astaCalciatoreAction";
import { useParams } from "react-router-dom";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";

const Searchbar = ({
  offertaAttuale,
  offerta1,
  offerta5,
  offerta10,
  sendOfferta,
}) => {
  const dispatch = useDispatch();
  console.log(offertaAttuale);
  const [calciatoreSelezionato, setCalciatoreSelezionato] = useState({});
  console.log(calciatoreSelezionato);
  //DEFINISCO IL FILTRO DA PASSARE AL MOMENTO DEL DISPATCH DEL'ACTION
  const [filters, setFilters] = useState({
    ruolo: "",
    cognome: "",
    squadra: "",
    valore: "",
  });

  const { id } = useParams();
  const dettagliAstaRecuperata = useSelector((state) => state.astaById.asta);
  // console.log("rotta id" + id);
  // console.log("dettagli atsa:" + JSON.stringify(dettagliAstaRecuperata));
  useEffect(() => {
    if (id) {
      console.log("id del dispatch" + id);
      dispatch(GetAstaByIdAction(id));
    }
  }, [id, dispatch]);
  const lista = useSelector((state) => state.calciatori.calciatori);
  console.log(lista);

  //DISPATCHO L'ACTION PASSANDOGLI I FILTRI
  //PER EVITARE CHIAMARE INUTILI: SE NON C'è NULLA NELL'INPUT NON FARE DISPATCH+ATTESA CHE L'UTENTE SMETTA DIS CRIVERE

  useEffect(() => {
    if (!filters.cognome) return;
    const attesaDigitazione = setTimeout(() => {
      dispatch(getAllCalciatoriAction(filters));
    }, 300);
    return () => clearTimeout(attesaDigitazione);
  }, [filters]);

  //AGGIORNO I FILTRI ALL'ONCHANGE
  const gestioneFiltri = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  //RESETTO I FILTRI
  // const reset = () => {
  //   setFilters({
  //     ruolo: "",
  //     cognome: "",
  //     squadra: "",
  //     valore: "",
  //   });
  // };
  const [timer, setTimer] = useState(10);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);
  return (
    <>
      <Container fluid className=" mt-4">
        <Row>
          <Col xs={12} md={8}>
            <Form className="d-flex margine">
              <div className=" d-flex flex-column w-100">
                <Form.Control
                  type="search"
                  placeholder="Cerca giocatore"
                  className="me-2"
                  aria-label="Search"
                  name="cognome"
                  value={filters.cognome}
                  onChange={gestioneFiltri}
                />
                <ListGroup>
                  {lista?.map((calciatore) => {
                    return (
                      <ListGroup.Item
                        key={calciatore.id}
                        onClick={() => {
                          setCalciatoreSelezionato(calciatore);
                          setFilters({
                            ...filters,
                            cognome: calciatore.cognome,
                          });
                        }}
                      >
                        {calciatore?.cognome}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </Form>
            <Row className=" text-center">
              <h1>
                <HourglassSplit />
                {timer}
              </h1>
            </Row>
            <Row className=" mt-2 text-center">
              <h1>{calciatoreSelezionato.nome_completo}</h1>
              <div>Offerta Attuale: {offertaAttuale}</div>
              <Button onClick={sendOfferta}>INVIA OFFERTA</Button>
              <Button
                onClick={() => {
                  setTimer(10);
                  setIsRunning(true);
                  dispatch(
                    astaCalciatoreAction(
                      calciatoreSelezionato.id,
                      dettagliAstaRecuperata.id
                    )
                  );
                }}
              >
                {" "}
                Inizia asta
              </Button>
            </Row>
            <Row className=" d-flex justify-content-evenly mt-3 ">
              <Button
                className=" border-0 w-25 fs-5 bg-info"
                onClick={offerta1}
              >
                +1
              </Button>
              <Button
                className=" border-0 w-25 fs-5 bg-success"
                onClick={offerta5}
              >
                +5
              </Button>
              <Button
                className=" border-0 w-25 fs-5 bg-warning"
                onClick={offerta10}
              >
                +10
              </Button>
            </Row>
          </Col>
          <Col xs={12} md={4}>
            <img src={calciatoreSelezionato.campioncino} alt="" />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Searchbar;
