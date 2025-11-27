import { Col, Container, Row } from "react-bootstrap";
import "./PillNav/PillNav";
import "./TextType/TextType";
import TextType from "./TextType/TextType";
import "../style/Hero.css";
const HeroSection = () => {
  return (
    <>
      <Container fluid className=" px-4  col-xxl-8 w-100">
        <Row className=" d-flex align-items-center g-5 py-5 flex-lg-row-reverse ">
          <Col className="col-10 col-sm-8 col-lg-6 mx-auto">
            <img
              src="src/assets/macbook-air-m2-15-inch.png"
              alt=""
              className=" w-100"
            />
          </Col>
          <Col className="col-lg-6 my-auto">
            {/* UTILIZZO COMPONENTE DI REACT BITS */}
            <TextType
              text={[
                "Il nuovo tool per la gestione delle aste!",
                "Facile! Veloce! Intuitivo!",
                "Inizia a rilanciare!",
              ]}
              typingSpeed={125}
              pauseDuration={3000}
              showCursor={true}
              cursorCharacter="|"
              className=" testo-hero text-warning h1"
            />

            <p className=" lead text-light">
              Organizza la tua asta nel modo perfetto, con AstaTool puoi gestire
              la tua asta online
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button
                type="button"
                className="btn btn-warning rounded-pill btn-lg px-4 me-md-2 text-light fw-bold"
              >
                Inizia Asta
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill btn-lg px-4"
              >
                Come Funziona
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default HeroSection;
