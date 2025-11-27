import Carousel from "react-bootstrap/Carousel";
import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "../style/carousel.css";
import { useDispatch, useSelector } from "react-redux";
import { getNewsAction } from "../redux/actions/getNewsActions";
import "../style/fireworks.css";
// INSERISCO UN CAROSELLO CON DELLE NOTIZIE SULLA SERIE A AGGIORNATE TRAMITE UN RSS DELLA GAZZETTA DELLO SPORT
function Mycarousel() {
  const dispatch = useDispatch();

  //FETCH PER RECUPERARE LE NOTIZIE
  useEffect(() => {
    dispatch(getNewsAction());
  }, []);

  const news = useSelector((state) => {
    return state.news.news;
  });
  return (
    <Container className=" border rounded-5 text-light my-5 gradienteDiSfondo ">
      <Row>
        <Col xs={12} md={3} className="position-relative ">
          <iframe
            id="sofa-standings-embed-33-76457"
            src="https://widgets.sofascore.com/it/embed/tournament/33/season/76457/standings/Serie%20A%2025%2F26?widgetTitle=Serie%20A%2025%2F26&showCompetitionLogo=true"
            style={{ height: "1123px", maxWidth: "308px" }}
            className="h-100 overflow-x-auto p-4 "
          ></iframe>
          <div className=" bottone-classifica position-absolute  z-3">
            <Button>Classifica Completa</Button>
          </div>
        </Col>
        <Col xs={12} md={9}>
          <Carousel fade className=" w-100 mx-auto p-4">
            {/* MAP DELLE NOTIZIE FORNITE DA GAZZETTA */}
            {news.map((singleNews, id) => (
              <Carousel.Item interval={7000} key={id}>
                <img
                  src={singleNews?.thumbnail}
                  alt=""
                  className=" w-100 mx-auto rounded-4"
                />
                <Carousel.Caption>
                  <h3>{singleNews?.title}</h3>
                  <p>{singleNews?.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default Mycarousel;
