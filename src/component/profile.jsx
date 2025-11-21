import { useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../redux/actions/checkAuth";
import MyNavbar from "./myNavbar";
import { Pencil } from "react-bootstrap-icons";
import "../style/profile.css";
import { uploadImg } from "../redux/actions/uploadImgActions";
import { Link } from "react-router-dom";
import PillNav from "./PillNav/PillNav";
import AnimatedList from "./AnimatedList/AnimatedList/AnimatedList";
export const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  const user = useSelector((state) => state.signIn.user);
  console.log(user);

  const urlUploaded = useSelector((state) => state.uploader.url);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(uploadImg(file));
    }
  };
  const imageSrc = urlUploaded || user?.avatar;
  const listaAste = user?.sessioni;
  return (
    <>
      <Container fluid className="  pt-5 bg-dark">
        <div className=" d-flex justify-content-center">
          <PillNav
            logo={"src/assets/fire.svg"}
            logoAlt="Company Logo"
            items={[
              { label: "ASTA", href: "/impostazioni-asta" },
              { label: "STRATEGIA", href: "/strategia" },
              { label: "CAMPETTO", href: "/campetto" },
              { label: "PROFILO", href: "/profile" },
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
        <Row className=" mt-4">
          <Col md={2}>
            <h3>Sidebar</h3>
          </Col>
          <Col md={6}>
            <Card style={{ width: "30rem" }}>
              <Card.Img variant="top" src={imageSrc} />

              <Form.Group controlId="formFile" className="mb-3 ">
                <Form.Control type="file" onChange={handleUpload} />
              </Form.Group>

              <Card.Body>
                <Card.Title className=" text-center mb-0">
                  {user?.nome} {user?.cognome}
                </Card.Title>
                <Card.Text className=" text-center mt-0">
                  ({user?.username})
                </Card.Text>

                <div className=" d-flex justify-content-around ">
                  <Button variant="warning">Modifica Profilo</Button>
                  <Button variant="danger">Elimina Profilo</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {/* INSERISCO LA LISTA DELLE ASTE DELL'UTENTE LOGGATO */}
          <Col md={4} className=" bg-warning rounded-3">
            <h2 className=" text-center">LE TUE ASTE</h2>
            {/* <ul className="overflow-y-scroll h-25 text-center">
              {listaAste?.map((asta, index) => (
                <a
                  href={`http://localhost:5173/sessioniAsta/${asta.id}`}
                  key={index}
                  className=" list-unstyled text-decoration-none text-light"
                >
                  <li className=" bg-dark my-1 rounded-3 mx-1  ">
                    {asta.nome}
                  </li>
                </a>
              ))} */}
            {listaAste ? (
              <AnimatedList
                items={listaAste}
                onItemSelect={(item, index) => console.log(item, index)}
                showGradients={true}
                enableArrowNavigation={true}
                displayScrollbar={true}
              />
            ) : (
              <h2>Effettua login per accedere alle impostazioni del profilo</h2>
            )}
            {/* </ul> */}
          </Col>
        </Row>
      </Container>
    </>
  );
};
