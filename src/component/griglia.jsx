import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import PlayerColumn from "./playerColumn";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";
import { useSelector } from "react-redux";

const Griglia = () => {
  const dettagliAsta = useSelector((state) => state.astaById.asta);
  console.log("Griglia monntata ", dettagliAsta);
  // Definisco gli utenti (giocatori) recuperandoli dallo stato della chiamata
  const utentiGiocatori = (dettagliAsta?.utenti || []).map((utente) => ({
    name: utente.username,
    crediti: dettagliAsta?.crediti,
  }));
  if (!dettagliAsta) {
    return <p>Caricamento griglia...</p>;
  }
  if (!dettagliAsta.utenti?.length) {
    return <p>In attesa che gli utenti entrino...</p>;
  }

  return (
    <>
      <Container className=" overflow-x-auto flex-nowrap" fluid>
        <Row className=" flex-nowrap">
          {utentiGiocatori.map((singoloUtente, index) => (
            <PlayerColumn
              key={index}
              nomeUtente={singoloUtente.name}
              crediti={singoloUtente.crediti}
            />
          ))}
        </Row>
      </Container>
    </>
  );
};
export default Griglia;
