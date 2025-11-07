import { useState } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { ArrowBarDown, ArrowBarUp } from "react-bootstrap-icons";

const PlayerColumn = ({ nomeUtente, crediti }) => {
  // Stato iniziale per i ruoli
  const [countP, setCountP] = useState(3);
  const [countD, setCountD] = useState(8);
  const [countC, setCountC] = useState(8);
  const [countA, setCountA] = useState(6);

  // Configurazione ruoli
  const roles = [
    {
      role: "P",
      count: countP,
      colorClass: "bg-warning text-light justify-content-center",
    },
    {
      role: "D",
      count: countD,
      colorClass: "bg-success text-light  justify-content-center",
    },
    {
      role: "C",
      count: countC,
      colorClass: "bg-info text-light  justify-content-center",
    },
    {
      role: "A",
      count: countA,
      colorClass: "bg-danger text-light  justify-content-center",
    },
  ];

  // Stato per lo stile delle freccie per dimnuire o aumentare le caselle
  const [sizeArrow1, setSizeArrow1] = useState("fs-3");
  const [sizeArrow2, setSizeArrow2] = useState("");

  return (
    <>
      {/* Questa parte rappresenta il nome dell'utente e i crediti residui */}
      <Col className="mx-3 my-5 p-0" xs={12} md={1}>
        <div className="sticky-top">
          <Row className=" text-center">
            <p>{nomeUtente}</p>
          </Row>
          <Row className=" justify-content-center fs-3 ">{crediti} FM</Row>
        </div>
        {/* Questa parte sotto va ripetuta per quanti sono i ruoli 3P, 8D, 8C, 6A */}
        {roles.map(({ ruolo, count, colorClass }) =>
          Array.from({ length: count }, (_, index) => (
            <div key={index}>
              {index === 0 && (
                <div key={index} className=" text-center">
                  <div>
                    <div className={`rounded-3 p-0 m-0 ${colorClass}`}>
                      <span>{ruolo}</span>
                      <p>0%</p>
                    </div>
                  </div>
                  <ArrowBarUp
                    onClick={() => {
                      if (ruolo === "P") setCountP(1);
                      if (ruolo === "D") setCountD(1);
                      if (ruolo === "C") setCountC(1);
                      if (ruolo === "A") setCountA(1);
                      setSizeArrow1("");
                      setSizeArrow2("fs-3");
                    }}
                    className={` pointer ${sizeArrow1} my-1`}
                  >
                    riduci
                  </ArrowBarUp>
                  <ArrowBarDown
                    onClick={() => {
                      if (ruolo === "P") setCountP(3);
                      if (ruolo === "D") setCountD(8);
                      if (ruolo === "C") setCountC(8);
                      if (ruolo === "A") setCountA(6);
                      setSizeArrow1("fs-3");
                      setSizeArrow2("");
                    }}
                    className={` pointer ${sizeArrow2} my-1`}
                  >
                    estendi
                  </ArrowBarDown>
                </div>
              )}
              <Row className=" d-flex ">
                <Form.Control />
                <InputGroup className="mb-3 p-0">
                  <InputGroup.Text className=" ">FM</InputGroup.Text>
                  <Form.Control />
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
