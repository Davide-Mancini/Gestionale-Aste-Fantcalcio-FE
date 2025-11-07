import { useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../redux/actions/checkAuth";
import MyNavbar from "./myNavbar";
import { Pencil } from "react-bootstrap-icons";
import "../style/profile.css";
import { uploadImg } from "../redux/actions/uploadImgActions";
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
  const listaAste = user.sessioni;
  return (
    <>
      <Container fluid className=" mt-5">
        <MyNavbar />

        <Row>
          <Col md={2}>
            <h3>Sidebar</h3>
          </Col>
          <Col md={6}>
            <Card style={{ width: "18rem" }}>
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
                <Card.Text className=" text-center">ASTE ATTIVE</Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
          {/* INSERISCO LA LISTA DELLE ASTE DELL'UTENTE LOGGATO */}
          <Col md={4}>
            <h2>LE TUE ASTE</h2>
            <ul>
              {listaAste.map((asta, index) => (
                <li key={index}>{asta.nome_asta}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </>
  );
};
