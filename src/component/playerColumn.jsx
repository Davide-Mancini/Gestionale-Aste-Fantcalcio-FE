import { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { ArrowBarDown, ArrowBarUp, Coin } from "react-bootstrap-icons";
import "../style/playerColumn.css";

const PlayerColumn = ({
  nomeUtente,
  utenteId,
  ultimoAcquisto,
  dettagliAsta,
}) => {
  const [countP, setCountP] = useState(3);
  const [countD, setCountD] = useState(8);
  const [countC, setCountC] = useState(8);
  const [countA, setCountA] = useState(6);

  const [crediti, setCrediti] = useState(0);
  const [caselle, setCaselle] = useState({
    P: Array(3).fill(null),
    D: Array(8).fill(null),
    C: Array(8).fill(null),
    A: Array(6).fill(null),
  });

  useEffect(() => {
    const caricaDatiIniziali = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/rosa/utente/${utenteId}/sessioni/${dettagliAsta.id}`
        );
        const data = await response.json();

        setCrediti(data.creditiResidui);

        // Ricostruisci le caselle FE basandoti sui dati del DB
        const nuoveCaselle = {
          P: Array(3).fill(null),
          D: Array(8).fill(null),
          C: Array(8).fill(null),
          A: Array(6).fill(null),
        };

        // Riempi le caselle con i giocatori già acquistati
        data.caselle.forEach((casella) => {
          if (casella.nomeCalciatore) {
            const ruolo = casella.ruolo;
            const index = casella.posizione - 1;
            if (
              nuoveCaselle[ruolo] &&
              nuoveCaselle[ruolo][index] !== undefined
            ) {
              nuoveCaselle[ruolo][index] = {
                nome: casella.nomeCalciatore,
                prezzo: casella.prezzoAcquisto,
              };
            }
          }
        });

        setCaselle(nuoveCaselle);
      } catch (error) {
        console.error("Errore caricamento dati:", error);
      }
    };

    if (utenteId) {
      caricaDatiIniziali();
    }
  }, [utenteId]); // Esegue SOLO una volta all'avvio

  useEffect(() => {
    if (!ultimoAcquisto) return;

    if (ultimoAcquisto.vincitore === nomeUtente) {
      const ruolo = ultimoAcquisto.ruolo;

      setCrediti(
        ultimoAcquisto.creditiResiduiVincitore - ultimoAcquisto.prezzo
      );

      // Aggiungi il giocatore alla prima casella libera
      setCaselle((prev) => {
        const nuovoRuoloArray = [...prev[ruolo]];
        const index = nuovoRuoloArray.findIndex((c) => c === null);
        if (index !== -1) {
          nuovoRuoloArray[index] = {
            nome: ultimoAcquisto.calciatore,
            prezzo: ultimoAcquisto.prezzo,
          };
        }
        return { ...prev, [ruolo]: nuovoRuoloArray };
      });
    }
  }, [ultimoAcquisto, nomeUtente]);

  console.log("ULTIMO ACQUISTO", ultimoAcquisto);
  const roles = [
    {
      role: "P",
      count: countP,
      colorClass: "bg-warning text-light justify-content-start",
    },
    {
      role: "D",
      count: countD,
      colorClass: "bg-success text-light justify-content-start",
    },
    {
      role: "C",
      count: countC,
      colorClass: "bg-info text-light justify-content-start",
    },
    {
      role: "A",
      count: countA,
      colorClass: "bg-danger text-light justify-content-start",
    },
  ];

  const [sizeArrow1, setSizeArrow1] = useState("fs-3");
  const [sizeArrow2, setSizeArrow2] = useState("");

  return (
    <>
      <Col className="mx-3 my-5 p-0" xs={12} md={1}>
        <div className="sticky-top bordi mb-1">
          <Row className="text-center">
            <p className="text-white fs-5 m-0">{nomeUtente}</p>
          </Row>
          <Row className="justify-content-center fs-3">
            <div className="d-flex justify-content-center align-items-center mb-2">
              <Coin className="text-warning me-2" />
              <p className="m-0 fw-bold text-white">{crediti}</p>
            </div>
          </Row>
        </div>

        {roles.map(({ role, count, colorClass }) =>
          caselle[role].slice(0, count).map((casella, index) => (
            <div key={role + index}>
              {index === 0 && (
                <div className="text-center">
                  <div>
                    <div className={`rounded-3 p-0 m-0 ${colorClass} d-flex`}>
                      <span className="text-white ms-1">{role}</span>
                      <p className="m-0 mx-auto">0%</p>
                    </div>
                  </div>
                  <ArrowBarUp
                    onClick={() => {
                      if (role === "P") setCountP(1);
                      if (role === "D") setCountD(1);
                      if (role === "C") setCountC(1);
                      if (role === "A") setCountA(1);
                      setSizeArrow1("");
                      setSizeArrow2("fs-3");
                    }}
                    className={`pointer ${sizeArrow1} my-1 text-white`}
                  />
                  <ArrowBarDown
                    onClick={() => {
                      if (role === "P") setCountP(3);
                      if (role === "D") setCountD(8);
                      if (role === "C") setCountC(8);
                      if (role === "A") setCountA(6);
                      setSizeArrow1("fs-3");
                      setSizeArrow2("");
                    }}
                    className={`pointer ${sizeArrow2} my-1 text-white`}
                  />
                </div>
              )}
              <Row className="d-flex trasparente p-2">
                <Form.Control
                  className="bg-transparent border-0 shadow-none text-light"
                  value={casella ? casella.nome : ""}
                  readOnly
                />
                <InputGroup className="mb-3 p-0">
                  <InputGroup.Text>FM</InputGroup.Text>
                  <Form.Control
                    className="shadow-none border-0"
                    value={casella ? casella.prezzo : ""}
                    readOnly
                  />
                </InputGroup>
              </Row>
            </div>
          ))
        )}
      </Col>
    </>
  );
};

export default PlayerColumn;
