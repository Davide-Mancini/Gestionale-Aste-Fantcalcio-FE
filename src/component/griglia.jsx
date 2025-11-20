import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import PlayerColumn from "./playerColumn";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";
import { useSelector } from "react-redux";
import "../style/griglia.css";
import { useEffect } from "react";

const Griglia = () => {
  const dettagliAsta = useSelector((state) => state.astaById.asta);
  console.log("Griglia monntata ", dettagliAsta);
  // Definisco gli utenti (giocatori) recuperandoli dallo stato della chiamata
  const utentiGiocatori = (dettagliAsta?.utenti || []).map((utente) => ({
    id: utente.id,
    name: utente.username,
    crediti: dettagliAsta?.crediti,
  }));
  console.log("lista utenti", utentiGiocatori);
  const ultimoAcquisto = useSelector(
    (state) => state.astaTerminata.ultimoAcquisto
  );
  console.log("ultimoAcquisto", ultimoAcquisto);
  useEffect(() => {
    if (ultimoAcquisto) {
      console.log("Aggiorno griglia con:", ultimoAcquisto);
    }
  }, [ultimoAcquisto]);
  if (!dettagliAsta) {
    return <p>Caricamento griglia...</p>;
  }
  if (!dettagliAsta.utenti?.length) {
    return <p>In attesa che gli utenti entrino...</p>;
  }

  return (
    <>
      <Container
        className=" overflow-x-auto flex-nowrap bg-dark rounded-5"
        fluid
      >
        <Row className=" flex-nowrap">
          {utentiGiocatori.map((singoloUtente, index) => (
            <PlayerColumn
              key={index}
              nomeUtente={singoloUtente.name}
              crediti={singoloUtente.crediti}
              ultimoAcquisto={ultimoAcquisto}
              utenteId={singoloUtente.id}
              dettagliAsta={dettagliAsta}
            />
          ))}
        </Row>
      </Container>
    </>
  );
};
export default Griglia;
