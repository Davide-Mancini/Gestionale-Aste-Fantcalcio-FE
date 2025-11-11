import Carousel from "react-bootstrap/Carousel";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
    <Container className=" border rounded-5 shadow text-light my-5 gradienteDiSfondo ">
      <Row>
        <Col xs={2}>
          <iframe
            id="sofa-standings-embed-33-76457"
            src="https://widgets.sofascore.com/it/embed/tournament/33/season/76457/standings/Serie%20A%2025%2F26?widgetTitle=Serie%20A%2025%2F26&showCompetitionLogo=true"
            style={{ height: "1123px", maxWidth: "768px", width: "100%" }}
            className=" overflow-x-auto"
          ></iframe>
        </Col>
        <Col xs={8}>
          <Carousel fade className=" w-100 mx-auto p-4">
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
        <Col xs={2}>
          <h1>prova</h1>
        </Col>
      </Row>
    </Container>
  );
}

export default Mycarousel;
