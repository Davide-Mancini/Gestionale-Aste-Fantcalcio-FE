import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";

import PillNav from "./PillNav/PillNav";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  CloudArrowUpFill,
  Coin,
  Crosshair,
  EyeFill,
  GraphUpArrow,
  Heart,
  Journals,
  Percent,
  Trash2Fill,
  X,
} from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { getAllCalciatoriAction } from "../redux/actions/getAllCalciatori";
import "../style/Strategia.css";
import { Link } from "react-router-dom";
import RegisterButton from "./registerButton";
import SignInButton from "./signInButton";
//FUNZIONE PER ESPORTARE STRATEGIE IN FILE CSV
const downloadCsv = (data, filename = "giocatori_preferiti.csv") => {
  if (data.length === 0) {
    alert("Nessun dato da esportare.");
    return;
  }
  //DEFINISCO LE INTESTAZIONE DELLE COLONNE
  const headers = [
    "ID",
    "Ruolo",
    "Nome Completo",
    "Squadra",
    "Quotazione",
    "Prezzo Asta Proposto (crediti)",
    "Percentuale Budget (%)",
    "Appunti",
  ];
  const csvData = data.map((calciatore) => {
    const prezzoAsta = calciatore.prezzoAsta || 0;
    const percentualeBudget = ((prezzoAsta * 100) / 500).toFixed(2);
    return [
      calciatore.id,
      calciatore.ruolo?.toUpperCase(),
      calciatore.nome_completo,
      calciatore.squadra,
      calciatore.valore,
      prezzoAsta,
      percentualeBudget,
    ]
      .map((value) => {
        //GESTIONE DELLE , " \N
        let stringValue = String(value);
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          stringValue = `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });
  const csvString = [headers.join(","), ...csvData].join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const Strategia = () => {
  const dispatch = useDispatch();
  const handleExportCsv = () => {
    //MOSTRA LA DATA
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadCsv(giocatoriMiPiace, `strategia_giocatori_${timestamp}.csv`);
  };
  //DEFINISCO IL FILTRO DA PASSARE AL MOMENTO DEL DISPATCH DEL'ACTION
  const [filters, setFilters] = useState({
    ruolo: "p",
    cognome: "",
    squadra: "",
    valore: "",
    pageNumber: 0,
  });
  const [nomeStrategia, setNomeStrategia] = useState("");
  const [budgetStrategia, setBudgetStrategia] = useState(500);
  const [appunti, setAppunti] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [playerDetailsTemporanei, setPlayerDetailsTemporanei] = useState({});

  const handleStrategyChange = (e) => {
    const { name, value } = e.target;
    if (name === "strategyName") setNomeStrategia(value);
    if (name === "strategyBudget") setBudgetStrategia(parseInt(value, 10) || 0);
    if (name === "strategyNotes") setAppunti(value);
  };

  const handlePlayerDetailChange = (id, field, value) => {
    setPlayerDetailsTemporanei((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: field === "prezzoAsta" ? parseInt(value, 10) || "" : value,
      },
    }));
  };

  const getPlayerDetail = (id, field) => {
    const details = playerDetailsTemporanei[id];
    return details ? details[field] : "";
  };
  useEffect(() => {
    const attesaDigitazione = setTimeout(() => {
      dispatch(getAllCalciatoriAction(filters));
    }, 300);
    return () => clearTimeout(attesaDigitazione);
  }, [filters, dispatch]);
  const lista = useSelector((state) => state.calciatori.calciatori);
  const [radioValue, setRadioValue] = useState("P");
  const radios = [
    { name: "P", value: "p" },
    { name: "D", value: "d" },
    { name: "C", value: "c" },
    { name: "A", value: "a" },
  ];
  const gestioneFiltri = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      pageNumber: 0,
    });
  };
  const gestioneRuolo = (val) => {
    setRadioValue(val);
    setFilters({
      ...filters,
      ruolo: val,
      pageNumber: 0,
    });
  };
  const cambiaPagina = (direzione) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber:
        direzione === "next" ? prev.pageNumber + 1 : prev.pageNumber - 1,
    }));
  };
  const [percentuali, setPercentuali] = useState({});
  const handlePercentuale = (id, valore) => {
    const percentuale = valore === "" ? "" : parseFloat(valore);
    setPercentuali((prev) => ({ ...prev, [id]: percentuale }));
  };
  console.log(percentuali);
  const [show2, setShow2] = useState(false);
  console.log(lista.pageNumber);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [giocatoriMiPiace, setGiocatoriMiPiace] = useState([]);
  const handleMiPiace = (calciatoreDaGestire) => {
    const calciatoreId = calciatoreDaGestire?.id;
    const isPresente = giocatoriMiPiace.some((g) => g.id === calciatoreId);

    if (isPresente) {
      setGiocatoriMiPiace((prevGiocatoreMiPiace) =>
        prevGiocatoreMiPiace.filter((g) => g.id !== calciatoreId)
      );
    } else {
      const ruolo = calciatoreDaGestire?.ruolo?.toUpperCase();

      if (ruolo === "P") {
        const portieriSelezionati = giocatoriMiPiace.filter(
          (g) => g.ruolo?.toUpperCase() === "P"
        ).length;

        if (portieriSelezionati >= 3) {
          alert(
            "ATTENZIONE: Hai raggiunto il limite massimo di 3 Portieri (P)."
          );
          return;
        }
      } else if (ruolo === "D") {
        const difensoriSelezionati = giocatoriMiPiace.filter(
          (g) => g.ruolo?.toUpperCase() === "D"
        ).length;
        if (difensoriSelezionati >= 8) {
          alert(
            "ATTENZIONE: Hai raggiunto il limite massimo di 8 Difensori (D)."
          );
          return;
        }
      } else if (ruolo === "C") {
        const centrocampistiSelezionati = giocatoriMiPiace.filter(
          (g) => g.ruolo?.toUpperCase() === "C"
        ).length;
        if (centrocampistiSelezionati >= 8) {
          alert(
            "ATTENZIONE: Hai raggiunto il limite massimo di 8 Centrocampisti (C)."
          );
          return;
        }
      } else if (ruolo === "A") {
        const attaccantiSelezionati = giocatoriMiPiace.filter(
          (g) => g.ruolo?.toUpperCase() === "A"
        ).length;
        if (attaccantiSelezionati >= 6) {
          alert(
            "ATTENZIONE: Hai raggiunto il limite massimo di 6 Attaccanti (A)."
          );
          return;
        }
      }
      const tempDetails = playerDetailsTemporanei[calciatoreId] || {};
      const prezzoAsta = tempDetails.prezzoAsta || 0;
      const tipo = tempDetails.tipo || "-";
      const appuntiGiocatore = tempDetails.appuntiGiocatore || "";
      setGiocatoriMiPiace((prevGiocatoreMiPiace) => [
        ...prevGiocatoreMiPiace,
        {
          ...calciatoreDaGestire,
          prezzoAsta: prezzoAsta,
          tipo: tipo,
          appuntiGiocatore: appuntiGiocatore,
        },
      ]);
    }
  };

  const [listaStrategie, setListaStrategie] = useState([]);
  const [loadingStrategie, setLoadingStrategie] = useState(true);
  // METODO PER RECUPERO DELLE STRATEGU
  const fetchAllStrategie = async () => {
    setLoadingStrategie(true);

    try {
      const response = await fetch(
        "rich-del-davide-mancini-9aa8ac64.koyeb.app/strategie",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

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

  useEffect(() => {
    // Chiama la funzione al caricamento del componente
    fetchAllStrategie();
  }, []);
  const tipi = ["O", "SCOMMESSA", "TITOLARE", "BOMBER", "JOLLY"];
  const user = useSelector((state) => {
    return state.signIn.user;
  });
  const handleSaveStrategy = () => {
    const dettagliPayload = giocatoriMiPiace.map((g) => ({
      calciatoreId: g.id,
      prezzoProposto: g.prezzoAsta || 0,
      tipo: g.tipo,
      appuntiGiocatore: g.appuntiGiocatore,
    }));

    const strategiaPayload = {
      nome: nomeStrategia || "Nuova Strategia",
      budgetTotale: budgetStrategia,
      appuntiGenerali: appunti,
      dettagli: dettagliPayload,
      utente: user?.id,
    };

    if (dettagliPayload.length === 0) {
      alert(
        "Aggiungi almeno un calciatore alla tua strategia prima di salvare!"
      );
      return;
    }

    console.log("Payload da inviare:", strategiaPayload);
    fetch("rich-del-davide-mancini-9aa8ac64.koyeb.app/strategie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(strategiaPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante il salvataggio");
        return res.json();
      })
      .then((data) => {
        alert(`Strategia '${data.nome}' salvata con successo!`);
        setGiocatoriMiPiace([]);
        setNomeStrategia("");
        setAppunti("");
        setPlayerDetailsTemporanei({});
        setShowSaveModal(false);
      })
      .catch((err) => {
        console.error("Errore di salvataggio:", err);
        alert("Errore nel salvataggio della strategia. Controlla la console.");
      });
  };
  console.log(lista);
  console.log(giocatoriMiPiace);
  const [strategiaCaricata, setStrategiaCaricata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchStrategiaById = async (strategiaId) => {
    if (!strategiaId) return;
    setIsLoading(true);
    setError(null);

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    try {
      const response = await fetch(
        `rich-del-davide-mancini-9aa8ac64.koyeb.app/strategie/${strategiaId}`,
        options
      );

      if (!response.ok) {
        throw new Error(
          `Errore HTTP: ${response.status} - Impossibile trovare la strategia.`
        );
      }

      const data = await response.json();
      setStrategiaCaricata(data);
    } catch (err) {
      console.error("Errore nel recupero della strategia:", err);
      setError("Impossibile caricare la strategia.");
      setStrategiaCaricata(null);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className=" d-flex justify-content-center">
        <PillNav
          logo={"public/fire.svg"}
          logoAlt="Company Logo"
          items={[
            { label: "ASTA", href: "/impostazioni-asta" },
            { label: "STRATEGIA", href: "/strategia" },
            { label: "NOTIZIE", href: "/campetto" },
            { label: "PROFILO", href: "/" },
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
          <Modal.Body>
            Sei sicuro di voler uscire dalla pagina Strategia?
          </Modal.Body>
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
      </div>
      <Container fluid>
        {" "}
        <Row className=" mt-5">
          <Col
            xs={12}
            md={2}
            className=" d-flex flex-column justify-content-center"
          >
            <Button
              variant="warning"
              className=" text-light fw-bold rounded-pill mb-1"
              onClick={() => setShowSaveModal(true)}
            >
              Crea Strategia <span>+</span>
            </Button>
            {loadingStrategie ? (
              <p>Caricamento strategie salvate...</p>
            ) : (
              <Form.Select
                className=" bg-warning rounded-pill  text-light text-center fw-bold border-0"
                onChange={(e) => fetchStrategiaById(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Seleziona strategia
                </option>
                {listaStrategie.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} (Budget: {s.budget})
                  </option>
                ))}
              </Form.Select>
            )}
          </Col>

          <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Salva la tua Strategia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Strategia</Form.Label>
                  <Form.Control
                    type="text"
                    name="strategyName"
                    value={nomeStrategia}
                    onChange={handleStrategyChange}
                    placeholder="Es. Titolari Low Cost"
                    className="form-strategia"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Budget Totale (Crediti)</Form.Label>
                  <Form.Control
                    type="number"
                    name="strategyBudget"
                    value={budgetStrategia}
                    onChange={handleStrategyChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Appunti Generali</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="strategyNotes"
                    value={appunti}
                    onChange={handleStrategyChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowSaveModal(false)}
              >
                Annulla
              </Button>
              <Button
                variant="warning"
                className="text-light"
                onClick={handleSaveStrategy}
              >
                Conferma e Salva
              </Button>
            </Modal.Footer>
          </Modal>
          <Col xs={12} md={7}>
            <Form.Control
              type="text"
              placeholder="Cerca Giocatore"
              name="cognome"
              onChange={gestioneFiltri}
              value={filters.cognome}
              className=" shadow-none"
            ></Form.Control>
            <ButtonGroup className=" w-100 mt-1">
              {radios.map((radio, idx) => (
                <ToggleButton
                  className="rounded-pill mx-1 border-3"
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={
                    idx === 0
                      ? "outline-warning"
                      : idx === 1
                      ? "outline-success"
                      : idx === 2
                      ? "outline-primary"
                      : idx === 3
                      ? "outline-danger"
                      : ""
                  }
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => gestioneRuolo(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
          <Col xs={12} md={3}>
            <Button
              variant="outline-light"
              className=" rounded-pill ms-2 border-3"
              onClick={handleExportCsv}
            >
              <CloudArrowUpFill className=" me-2" />
              Esporta Strategia
            </Button>
            <Button
              variant="outline-danger"
              className=" ms-2 rounded-pill border-3"
              onClick={() => {
                setGiocatoriMiPiace([]);
              }}
            >
              <Trash2Fill className=" me-1" />
              Elimina
            </Button>
          </Col>
        </Row>
        {!user ? (
          <div className=" vh-100 text-center text-light mt-5">
            <h1>Effettua Login per creare strategie</h1>
            <p>
              Per usufruire del tool di Strategia è necessario essere registrati
              ed aver effettuato l'accesso
            </p>
            <SignInButton />
            <RegisterButton />
          </div>
        ) : (
          <Row className=" mt-3">
            <Col xs={12} md={8}>
              {lista.map((calciatore) => {
                const selezionato = giocatoriMiPiace.some(
                  (g) => g.id === calciatore?.id
                );
                return (
                  <Row key={calciatore?.id} className=" mt-2">
                    <Col className=" d-flex text-light align-items-center  ">
                      <Heart
                        style={{ cursor: "pointer" }}
                        className={`fs-3 me-3 ${
                          selezionato ? "text-danger" : " "
                        } `}
                        onClick={() => {
                          handleMiPiace(calciatore);
                        }}
                      />

                      <img
                        src={calciatore?.campioncino}
                        alt=""
                        className="imgsize me-3"
                      />

                      <Col className=" w-25">
                        <h5 className=" m-0">{calciatore?.nome_completo}</h5>
                        <p className=" m-0">{calciatore?.squadra}</p>
                      </Col>
                      <Col className=" d-flex justify-content-center flex-column align-items-center me-1">
                        <Col className=" d-flex align-items-center  ">
                          <Coin className=" me-1 text-warning" />
                          <small className=" m-0">Prezzo</small>
                        </Col>
                        <Form.Control
                          type="number"
                          className="form-strategia trasparente text-warning text-center"
                          value={
                            getPlayerDetail(calciatore?.id, "prezzoAsta") || ""
                          }
                          onChange={(e) =>
                            handlePlayerDetailChange(
                              calciatore?.id,
                              "prezzoAsta",
                              e.target.value
                            )
                          }
                          disabled={selezionato}
                        ></Form.Control>
                      </Col>
                      <Col className=" d-flex justify-content-center flex-column align-items-center me-1">
                        <Col className=" d-flex align-items-center  ">
                          <Percent className=" me-1 text-warning" />
                          <small>Budget</small>
                        </Col>
                        <Form.Control
                          type="number"
                          className="form-strategia trasparente text-warning text-center"
                          onChange={(e) => {
                            handlePercentuale(calciatore?.id, e.target.value);
                          }}
                          value={
                            budgetStrategia > 0 &&
                            getPlayerDetail(calciatore?.id, "prezzoAsta") > 0
                              ? (
                                  (getPlayerDetail(
                                    calciatore?.id,
                                    "prezzoAsta"
                                  ) *
                                    100) /
                                  budgetStrategia
                                ).toFixed(1)
                              : 0
                          }
                        ></Form.Control>
                      </Col>
                      <Col className=" d-flex justify-content-center flex-column align-items-center me-1">
                        <Col className=" d-flex align-items-center  ">
                          <Journals className=" me-1 text-warning" />
                          <small>Appunti</small>
                        </Col>
                        <Form.Control
                          className="form-strategia trasparente text-warning text-center"
                          value={getPlayerDetail(
                            calciatore?.id,
                            "appuntiGiocatore"
                          )}
                          onChange={(e) =>
                            handlePlayerDetailChange(
                              calciatore?.id,
                              "appuntiGiocatore",
                              e.target.value
                            )
                          }
                          disabled={selezionato}
                        ></Form.Control>
                      </Col>
                      <Col className=" d-flex justify-content-center flex-column align-items-center me-1">
                        <Col className=" d-flex align-items-center  ">
                          <EyeFill className=" me-1 text-warning" />
                          <small>Tipo</small>
                        </Col>
                        <Form.Select
                          name="tipo"
                          className=" trasparente text-warning text-center px-0"
                          value={
                            getPlayerDetail(calciatore?.id, "tipo") || tipi[0]
                          }
                          onChange={(e) =>
                            handlePlayerDetailChange(
                              calciatore?.id,
                              "tipo",
                              e.target.value
                            )
                          }
                          disabled={selezionato}
                        >
                          {tipi.map((tipo) => (
                            <option
                              className=" bg-dark"
                              key={tipo}
                              value={tipo}
                            >
                              {tipo}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col className=" d-flex justify-content-center flex-column align-items-center">
                        <Col className=" d-flex align-items-center  ">
                          <GraphUpArrow className=" me-1 text-warning" />
                          <small>Quotazione</small>
                        </Col>
                        <Form.Control
                          className="form-strategia trasparente text-warning text-center"
                          readOnly
                          value={calciatore?.valore}
                        ></Form.Control>
                      </Col>
                    </Col>
                  </Row>
                );
              })}

              <div className=" d-flex justify-content-center ">
                <ArrowLeft
                  style={{ cursor: "pointer" }}
                  className=" text-light fs-3"
                  onClick={() => cambiaPagina("prev")}
                />

                <ArrowRight
                  style={{ cursor: "pointer" }}
                  className=" text-light fs-3"
                  onClick={() => cambiaPagina("next")}
                />
              </div>
            </Col>
            <Col xs={12} md={4} className=" text-light">
              <h2 className=" text-center">Strategia</h2>
              {isLoading && (
                <p className="text-warning text-center">
                  Caricamento in corso...
                </p>
              )}
              {error && <p className="text-danger text-center">{error}</p>}
              {strategiaCaricata && !isLoading && (
                <>
                  <p className=" text-center">{`(${strategiaCaricata.nome})`}</p>
                  <p>
                    Appunti Strategia: <br />
                    {strategiaCaricata.appunti ||
                      "Nessun appunto presente per questa strategia"}
                  </p>
                  {strategiaCaricata.dettagli.map((dettaglio) => (
                    <div
                      key={dettaglio.id}
                      className={` rounded-pill text-center d-flex mb-1 justify-content-around align-items-center ${
                        dettaglio?.calciatori?.ruolo === "P"
                          ? "bg-warning"
                          : dettaglio?.calciatori?.ruolo === "D"
                          ? "bg-success"
                          : dettaglio?.calciatori?.ruolo === "C"
                          ? "bg-primary"
                          : dettaglio?.calciatori?.ruolo === "A"
                          ? "bg-danger"
                          : ""
                      }`}
                    >
                      <Col className="">
                        <small>Ruolo</small>
                        <p className=" fw-bold ">
                          {dettaglio?.calciatori?.ruolo}
                        </p>
                      </Col>
                      <Col>
                        <small>Nome</small>
                        <p className=" fw-bold ">
                          {dettaglio?.calciatori?.cognome}
                        </p>
                      </Col>
                      <Col>
                        <small>Prezzo</small>
                        <p className=" fw-bold">{dettaglio?.prezzoProposto}</p>
                      </Col>
                      <Col>
                        <small>Budget %</small>
                        <p className=" fw-bold">{dettaglio?.percentuale}</p>
                      </Col>
                      <Col>
                        <small>Tipo</small>
                        <p className=" fw-bold">{dettaglio?.tipoGiocatore}</p>
                      </Col>
                      <Col>
                        <small>Appunti</small>
                        <p
                          className=" fw-bold text-truncate"
                          style={{ maxWidth: "50px" }}
                          title={dettaglio?.appuntiGiocatore}
                        >
                          {dettaglio?.appuntiGiocatore ? "..." : "-"}
                        </p>
                      </Col>
                      <X
                        style={{ cursor: "pointer" }}
                        className=" fs-3 text-danger end"
                        onClick={() => {
                          handleMiPiace(dettaglio);
                        }}
                      />
                    </div>
                  ))}
                </>
              )}
              {giocatoriMiPiace.map((calciatore) => {
                return (
                  <div
                    key={calciatore?.id}
                    className={` rounded-pill text-center d-flex mb-1 justify-content-around align-items-center ${
                      calciatore?.ruolo === "P"
                        ? "bg-warning"
                        : calciatore?.ruolo === "D"
                        ? "bg-success"
                        : calciatore?.ruolo === "C"
                        ? "bg-primary"
                        : calciatore?.ruolo === "A"
                        ? "bg-danger"
                        : ""
                    }`}
                  >
                    {/* <img
                      src={calciatore.campioncino}
                      alt=""
                      style={{ width: "40px" }}
                      className=" ms-1"
                    /> */}

                    <Col className="">
                      <small>Ruolo</small>
                      <p className=" fw-bold ">{calciatore?.ruolo}</p>
                    </Col>
                    <Col key={calciatore?.id}>
                      <small>Nome</small>
                      <p className=" fw-bold ">{calciatore.cognome}</p>
                    </Col>
                    <Col>
                      <small>Prezzo</small>
                      <p className=" fw-bold">{calciatore.prezzoAsta}</p>
                    </Col>
                    <Col>
                      <small>Budget %</small>
                      <p className=" fw-bold">
                        {(calciatore.prezzoAsta * 100) / budgetStrategia}
                      </p>
                    </Col>
                    <Col>
                      <small>Tipo</small>
                      <p className=" fw-bold">{calciatore.tipo}</p>
                    </Col>
                    <Col>
                      <small>Appunti</small>
                      <p
                        className=" fw-bold text-truncate"
                        style={{ maxWidth: "50px" }}
                        title={calciatore.appuntiGiocatore}
                      >
                        {calciatore.appuntiGiocatore ? "..." : "-"}
                      </p>
                    </Col>
                    <X
                      style={{ cursor: "pointer" }}
                      className=" fs-3 text-danger end"
                      onClick={() => {
                        handleMiPiace(calciatore);
                      }}
                    />
                  </div>
                );
              })}
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};
export default Strategia;
