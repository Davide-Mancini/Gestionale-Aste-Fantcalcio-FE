import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";
import "../style/searchbar.css";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftCircle,
  Cloud,
  CloudArrowUpFill,
  CloudFill,
  Coin,
  Copy,
  HourglassSplit,
  PeopleFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllCalciatoriAction } from "../redux/actions/getAllCalciatori";

import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";
import { Link } from "react-router-dom";
import ElectricBorder from "./ElectricBorder/ElectricBorder/ElectricBorder";

const Searchbar = ({
  offertaAttuale,
  sendOfferta,
  calciatoreSelezionato,
  handleSelezionaCalciatore,
  handleIniziaAsta,
  astaCalciatore,
  offerente,
  handleFineAsta,
  azzeraOfferta,
  dettagliAstaRecuperata,
  handleExportCsv,
  tutteLeRose,
}) => {
  const dispatch = useDispatch();
  //DEFINISCO IL FILTRO DA PASSARE AL MOMENTO DEL DISPATCH DEL'ACTION
  const [filters, setFilters] = useState({
    ruolo: "",
    cognome: "",
    squadra: "",
    valore: "",
  });

  // const { id } = useParams();
  // useEffect(() => {
  //   if (id) {
  //     console.log("id del dispatch" + id);
  //     dispatch(GetAstaByIdAction(id));
  //   }
  // }, [id, dispatch]);

  const lista = useSelector((state) => state.calciatori.calciatori);
  //Qui filtro la lista in base ai giocatori gia acquistati (già presenti nelle rose degli utenti) eliminando quelli gia presi.
  //Cerco i giocatori già presi in tutteRose
  const GiocatoriGiaPresi = Object.values(tutteLeRose || {})
    .flat()
    .map((g) => g["Nome Giocatore"]?.toLowerCase().trim());
  //Filtro la listab originale con i giocatori gia presi
  const listaFiltrata = lista?.filter((calciatore) => {
    const cognomeCercato = calciatore.cognome?.toLowerCase().trim();
    return !GiocatoriGiaPresi.includes(cognomeCercato);
  });
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

  const [show, setShow] = useState(false);
  const inviaRapido = (incremento) => {
    const base = parseInt(offertaAttuale) || 0;
    const nuovoValore = base + incremento;

    sendOfferta(nuovoValore);
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [copia, setCopia] = useState(false);
  //FUNZIONE PER COPIARE L'URL DA INVIARE AD AMICI, MODIFICA LO STATO COPIA PER POTER CAMBIARE LA SCRITTA E DOPO 3 SEC TORNA NORMALE
  const handleCopia = () => {
    const testoDaCopiare = `http://localhost:5173/sessioniAsta/${dettagliAstaRecuperata?.id}`;
    navigator.clipboard.writeText(testoDaCopiare);
    setCopia(true);
    setTimeout(() => {
      setCopia(false);
    }, 3000);
  };
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const hasAcquisti = Object.values(tutteLeRose).flat().length > 0;
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    let timerId;
    if (timer === 0) {
      setShowAlert(true);
      timerId = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [timer]);
  return (
    <>
      <div className=" d-flex">
        <Button
          variant="outline-light mt-2"
          className=" rounded-pill"
          onClick={handleShow2}
        >
          <ArrowLeft className=" fs-3" />
        </Button>
        <Modal show={show2} onHide={handleClose2}>
          <Modal.Header closeButton>
            <Modal.Title>Torna in Homepage</Modal.Title>
          </Modal.Header>
          <Modal.Body>Sei sicuro di voler uscire dall'asta?</Modal.Body>
          <Modal.Footer>
            <Link
              to={"/"}
              className=" text-light btn btn-warning"
              onClick={handleClose2}
            >
              Si
            </Link>
            <Button variant="danger" onClick={handleClose2}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
        <h3 className=" mt-2 ms-2 text-warning">
          {dettagliAstaRecuperata?.nome_asta}
        </h3>
      </div>
      <div className=" d-flex flex-row-reverse me-5 mb-2">
        <Button
          variant="outline-light"
          className=" mx-1"
          onClick={handleExportCsv}
          //SE ANCORA NON CI SONO ACQUISTI IL BOTTONE è DISBAILITATO, APPENA VIENE PRESO UN CALCIATORE SI ATTIVA
          disabled={!hasAcquisti}
        >
          <CloudArrowUpFill className=" me-1 fs-5" />
          ESPORTA ASTA
        </Button>
        <Button variant="outline-warning" onClick={handleShow}>
          <PeopleFill className=" me-1 fs-5" />
          INVITA AMICI
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Invita Amici</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Invia il link qui sotto ai tuoi amici per farli partecipare all'asta{" "}
          </Modal.Body>
          <Modal.Body className=" fw-bold ">
            <small>
              http://localhost:5173/sessioniAsta/{dettagliAstaRecuperata?.id}
            </small>
            <Button
              variant="warning"
              className=" p-0 ms-2 fw-bold text-light w-25"
              onClick={handleCopia}
            >
              <Copy className=" me-2" />
              {copia ? "COPIATO!" : "COPIA"}
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Container fluid className=" bg-warning rounded-5">
        <Row>
          {showAlert && timer == 0 && (
            <Alert className=" text-center">
              {" "}
              <span className=" fw-bold">{offerente}</span> ha acquistato{" "}
              <span className=" fw-bold">
                {" "}
                {astaCalciatore ? astaCalciatore.nomeCalciatore : ""}
              </span>{" "}
              per <span className=" fw-bold">{offertaAttuale}</span> FM
            </Alert>
          )}
          <Col xs={12} md={8} className=" mb-5 px-5">
            <Form className="d-flex margine">
              <div className=" d-flex flex-column w-100">
                <h1 className=" fw-bold">Cerca Giocatore</h1>
                <Form.Control
                  type="search"
                  placeholder="Cerca giocatore"
                  className="form-cerca-giocatori me-2"
                  aria-label="Search"
                  name="cognome"
                  value={filters.cognome}
                  onChange={gestioneFiltri}
                />
                <ListGroup>
                  {listaFiltrata?.map((calciatore) => {
                    return (
                      <ListGroup.Item
                        style={{ cursor: "pointer" }}
                        key={calciatore.id}
                        onClick={() => {
                          handleSelezionaCalciatore(calciatore);
                          setFilters({
                            ...filters,
                            cognome: calciatore.cognome + " ",
                          });
                          setTimer(10);
                          azzeraOfferta();
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
                  <HourglassSplit
                    className={`${
                      timer < 9 && timer !== 0 ? "lampeggia" : ""
                    } fs-1 text-white me-2`}
                  />
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
                <div className=" ms-2 d-flex justify-content-center align-items-center my-3 bg-dark p-2 rounded-pill w-25 border border-3 border-white">
                  <h3 className=" text-light">{offerente || "-"}</h3>
                </div>
              </Row>
            )}
            {Object.keys(calciatoreSelezionato).length !== 0 && (
              <Row className=" mt-2 text-center">
                {astaCalciatore?.statoAsta !== "APERTA" && (
                  <Button
                    className=" text-warning fs-5 rounded-pill fw-bold"
                    variant="dark"
                    onClick={() => {
                      handleIniziaAsta();
                      setTimer(10);
                      setIsRunning(true);
                    }}
                  >
                    {" "}
                    INIZIA ASTA
                  </Button>
                )}
              </Row>
            )}
            {Object.keys(calciatoreSelezionato).length !== 0 &&
              astaCalciatore?.statoAsta === "APERTA" && (
                <Row className=" d-flex justify-content-evenly mt-3 ">
                  <button
                    disabled={astaCalciatore?.statoAsta !== "APERTA"}
                    className="pushable w-25"
                    onClick={() => {
                      inviaRapido(1);
                    }}
                  >
                    <span className="shadow"></span>
                    <span className="edge"></span>
                    <span className="front"> +1 </span>
                  </button>
                  <button
                    className="pushable w-25"
                    onClick={() => {
                      inviaRapido(5);
                    }}
                  >
                    <span className="shadow"></span>
                    <span className="edge"></span>
                    <span className="front"> +5 </span>
                  </button>
                  <button
                    className="pushable w-25"
                    onClick={() => {
                      inviaRapido(10);
                    }}
                  >
                    <span className="shadow"></span>
                    <span className="edge"></span>
                    <span className="front"> +10 </span>
                  </button>
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
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Searchbar;
