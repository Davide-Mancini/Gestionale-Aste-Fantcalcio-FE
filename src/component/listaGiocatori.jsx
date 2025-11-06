import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllCalciatoriAction } from "../redux/actions/getAllCalciatori";
import MyNavbar from "./myNavbar";

export const ListaGiocatori = () => {
  //DEFINISCO IL FILTRO DA PASSARE AL MOMENTO DEL DISPATCH DEL'ACTION
  const [filters, setFilters] = useState({
    ruolo: "",
    cognome: "",
    squadra: "",
    valore: "",
  });

  const lista = useSelector((state) => state.calciatori.calciatori.content);
  console.log(lista);
  const dispatch = useDispatch();

  //DISPATCHO L'ACTION PASSANDOGLI I FILTRI
  useEffect(() => {
    dispatch(getAllCalciatoriAction(filters));
  }, [dispatch, filters]);

  //AGGIORNO I FILTRI ALL'ONCHANGE
  const gestioneFiltri = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  //RESETTO I FILTRI
  const reset = () => {
    setFilters({
      ruolo: "",
      cognome: "",
      squadra: "",
      valore: "",
    });
  };

  return (
    <Container>
      <MyNavbar />
      <Row>
        <Col md={3}>
          <Form.Control
            name="cognome"
            placeholder="Cerca per cognome"
            value={filters.cognome}
            onChange={gestioneFiltri}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            name="ruolo"
            value={filters.ruolo}
            onChange={gestioneFiltri}
          >
            <option value="">Tutti i ruoli</option>
            <option value="p">Portiere</option>
            <option value="d">Difensore</option>
            <option value="c">Centrocampista</option>
            <option value="a">Attaccante</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            name="squadra"
            placeholder="Cerca per squadra"
            value={filters.squadra}
            onChange={gestioneFiltri}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            name="valore"
            type="number"
            placeholder="Valore max"
            value={filters.valore}
            onChange={gestioneFiltri}
          />
        </Col>
        <Col md={1}>
          <Button variant="secondary" onClick={reset}>
            Reset
          </Button>
        </Col>
      </Row>
      <Row>
        {lista?.map((calciatore) => (
          <Col key={calciatore.id}>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={calciatore?.campioncino} />
              <Card.Body>
                <Card.Title>{calciatore?.cognome}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
