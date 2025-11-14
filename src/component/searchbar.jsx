import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import "../style/searchbar.css";
import { useEffect, useState } from "react";
import { Coin, HourglassSplit } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllCalciatoriAction } from "../redux/actions/getAllCalciatori";
import { useParams } from "react-router-dom";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";

const Searchbar = ({
  offertaAttuale,
  offerta1,
  offerta5,
  offerta10,
  sendOfferta,
  calciatoreSelezionato,
  handleSelezionaCalciatore,
  handleIniziaAsta,
  astaCalciatore,
  offerente,
  handleFineAsta,
}) => {
  const dispatch = useDispatch();
  //DEFINISCO IL FILTRO DA PASSARE AL MOMENTO DEL DISPATCH DEL'ACTION
  const [filters, setFilters] = useState({
    ruolo: "",
    cognome: "",
    squadra: "",
    valore: "",
  });

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      console.log("id del dispatch" + id);
      dispatch(GetAstaByIdAction(id));
    }
  }, [id, dispatch]);
  const lista = useSelector((state) => state.calciatori.calciatori);

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

  const [isRunning, setIsRunning] = useState(false);
  const [cliccato, setCliccato] = useState(false);
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

  //Timer calcolato tramite data inizio dell'asta e la durata in secondi gia stabilita nel back-end
  const [timer, setTimer] = useState(null);
  useEffect(() => {
    if (!astaCalciatore?.dataInizio) return;

    const durata = astaCalciatore.durataSecondi || 10;
    //GetTime ritorna la data in lmiillisecondi
    const inizio = new Date(astaCalciatore.dataInizio).getTime();
    //qui definisico la fine nel futuro, prendo l'inizio come .now e gli aggiungo i 10 secondi
    const fine = inizio + durata * 1000;
    const interval = setInterval(() => {
      const ora = Date.now();
      //Per stabilire i secondi rimanenti uso il .max che prende il numero massimo tra quelli a sua disposizione, in questo caso tra 0 e la differenza tra
      //la fine (sarebbe .now+10) e .now
      const secondiRimanenti = Math.max(0, Math.floor((fine - ora) / 1000));
      setTimer(secondiRimanenti);
      if (secondiRimanenti <= 0) {
        clearInterval(interval);
        console.log("Asta finita");
        handleFineAsta();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    astaCalciatore?.dataInizio,
    astaCalciatore?.durataSecondi,
    handleFineAsta,
  ]);
  console.log("timeeeeeeeer", timer);
  console.log("OFFERTAAAA ATTUALE", astaCalciatore);

  const [iniziaAstaButton, setIniziaAstaButton] = useState(true);

  return (
    <>
      <Container fluid className=" mt-4 bg-warning rounded-5">
        <Row>
          <Col xs={12} md={8} className=" mb-5 px-5">
            {timer == 0 && (
              <Alert>
                {" "}
                <span className=" fw-bold">{offerente}</span> ha acquistato{" "}
                <span className=" fw-bold">
                  {" "}
                  {astaCalciatore.nomeCalciatore}
                </span>{" "}
                per <span className=" fw-bold">{offertaAttuale}</span> FM
              </Alert>
            )}
            <Form className="d-flex margine">
              <div className=" d-flex flex-column w-100">
                <h1>Cerca Giocatore</h1>
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
                          handleSelezionaCalciatore(calciatore);
                          setFilters({
                            ...filters,
                            cognome: calciatore.cognome,
                          });
                          setCliccato(true);
                          setTimer(10);
                          setIniziaAstaButton(true);
                        }}
                      >
                        {calciatore?.cognome}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </Form>
            {Object.keys(calciatoreSelezionato).length !== 0 && (
              <Row className=" text-center d-flex justify-content-center">
                <div className=" me-2 d-flex justify-content-center align-items-center my-3 bg-dark p-2 rounded-pill w-25 border border-3 border-white">
                  <HourglassSplit className=" fs-1 text-white me-2" />
                  <h1 className=" m-0 text-white">
                    {timer !== null ? (
                      <div> {timer}</div>
                    ) : (
                      <div>
                        {" "}
                        <p className=" m-0">10</p>{" "}
                      </div>
                    )}
                  </h1>
                </div>
                <div className=" ms-2 d-flex justify-content-center align-items-center my-3 bg-dark p-2 rounded-pill w-25 border border-3 border-white">
                  <Coin className=" fs-1 text-warning me-2" />{" "}
                  <h1 className=" m-0 text-white">{offertaAttuale}</h1>{" "}
                </div>
              </Row>
            )}
            {Object.keys(calciatoreSelezionato).length !== 0 && (
              <Row className=" mt-2 text-center">
                {!astaCalciatore && (
                  <Button
                    className=" text-warning fs-5"
                    variant="dark"
                    onClick={() => {
                      setIniziaAstaButton(false);
                      handleIniziaAsta();
                      setTimer(10);
                      setIsRunning(true);
                      // dispatch(
                      //   astaCalciatoreAction(
                      //     calciatoreSelezionato.id,
                      //     dettagliAstaRecuperata.id
                      //   )
                      // );
                    }}
                  >
                    {" "}
                    INIZIA ASTA
                  </Button>
                )}

                <Button onClick={sendOfferta} className=" my-3">
                  INVIA OFFERTA
                </Button>
              </Row>
            )}
            {Object.keys(calciatoreSelezionato).length !== 0 && (
              <Row className=" d-flex justify-content-evenly mt-3 ">
                <button className="pushable w-25" onClick={offerta1}>
                  <span className="shadow"></span>
                  <span className="edge"></span>
                  <span className="front"> +1 </span>
                </button>
                <button className="pushable w-25" onClick={offerta5}>
                  <span className="shadow"></span>
                  <span className="edge"></span>
                  <span className="front"> +5 </span>
                </button>
                <button className="pushable w-25" onClick={offerta10}>
                  <span className="shadow"></span>
                  <span className="edge"></span>
                  <span className="front"> +10 </span>
                </button>
                {/* <Button
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
              </Button> */}
              </Row>
            )}
          </Col>
          <Col
            xs={12}
            md={4}
            className=" d-flex h-100 justify-content-center my-auto flex-column "
          >
            <div className=" mx-auto mt-2 ">
              <img
                src={
                  calciatoreSelezionato.immagineUrl ||
                  "https://content.fantacalcio.it/web/campioncini/20/card/6677.png?v=341"
                }
                alt=""
                className=" d-block mx-auto h-100"
              />
              <h1>{calciatoreSelezionato.nomeCompleto}</h1>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Searchbar;
