import { Container } from "react-bootstrap";
import Griglia from "./griglia";
import ImpostazioniAsta from "./impostazioniAsta";
import MyNavbar from "./myNavbar";
import Searchbar from "./searchbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";

const Asta = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const dettagliAstaRecuperata = useSelector((state) => state.astaById.asta);
  console.log("rotta id" + id);
  console.log("dettagli atsa:" + JSON.stringify(dettagliAstaRecuperata));

  useEffect(() => {
    if (id) {
      console.log("id del dispatch" + id);
      dispatch(GetAstaByIdAction(id));
    }
  }, [id, dispatch]);
  console.log("dopo dipsatch" + JSON.stringify(dettagliAstaRecuperata));
  // if (!dettagliAstaRecuperata || !dettagliAstaRecuperata.id) {
  //   return <p>Caricamento...</p>;
  // }
  return (
    <>
      <MyNavbar />
      <Container fluid>
        <h2>{dettagliAstaRecuperata?.nome_asta}</h2>
        <Searchbar />
        <Griglia />
      </Container>
    </>
  );
};
export default Asta;
