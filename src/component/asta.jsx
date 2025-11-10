import { Container } from "react-bootstrap";
import Griglia from "./griglia";
import ImpostazioniAsta from "./impostazioniAsta";
import MyNavbar from "./myNavbar";
import Searchbar from "./searchbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";
import SockJS from "sockjs-client";
import Stomp, { over } from "stompjs";
import { addUserToAstaAction } from "../redux/actions/addUserToAstaAction";

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

  const [offerte, setOfferte] = useState([]);
  const [offerta, setOfferta] = useState(0);
  const [username, setUsername] = useState("");
  const user = useSelector((state) => {
    return state.signIn.user;
  });
  console.log(user);
  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);
  const [stompClient, setStompClient] = useState(null);
  const [offertaAttuale, setOffertaAttuale] = useState(1);
  console.log(username);
  console.log(offerta);
  console.log(offerte);
  useEffect(() => {
    window.global = window;
    const socket = new SockJS("http://localhost:3001/ws");
    const client = over(socket);
    client.connect({}, (frame) => {
      console.log(frame);
      client.subscribe(
        `/topic/public/${dettagliAstaRecuperata?.id}`,
        (offerta) => {
          const offertaRicevita = JSON.parse(offerta.body);
          setOffertaAttuale(offertaRicevita.valoreOfferta);
        }
      );
    });
    setStompClient(client);
    return () => {
      if (client && client.connect) client.disconnect();
    };
  }, []);

  const handleOfferta1 = () => {
    setOfferta(offertaAttuale + 1);
  };
  const handleOfferta5 = () => {
    setOfferta(offertaAttuale + 5);
  };
  const handleOfferta10 = () => {
    setOfferta(offertaAttuale + 10);
  };

  const sendOfferta = () => {
    if (!stompClient || !stompClient.connected) {
      console.log("Stomp non connesso");
      return;
    }
    if (offerta && username) {
      const offertaAsta = {
        valoreOfferta: offerta,
        offerente: user.id,
        asta: dettagliAstaRecuperata.id,
      };
      stompClient.send("/app/inviaofferta", {}, JSON.stringify(offertaAsta));
      setOffertaAttuale(offertaAsta.valoreOfferta);
      console.log(offertaAsta.valoreOfferta);
    } else {
      console.log("inserire nickname e offerta");
    }
  };

  console.log(dettagliAstaRecuperata);
  //ISCRIZIONE UTENTE A ASTA
  useEffect(() => {
    if (user?.id && dettagliAstaRecuperata?.id) {
      //DISPATCH DELLA CHIAMATA CHE REGISTRA UTENTE A ASTA
      dispatch(addUserToAstaAction(dettagliAstaRecuperata.id, user.id));
    }
  }, [user, id]);
  return (
    <>
      <MyNavbar />
      <Container fluid>
        <h2 className=" mt-5">{dettagliAstaRecuperata?.nome_asta}</h2>
        <Searchbar
          offertaAttuale={offertaAttuale}
          offerta1={handleOfferta1}
          offerta5={handleOfferta5}
          offerta10={handleOfferta10}
          sendOfferta={sendOfferta}
        />
        <Griglia />
      </Container>
    </>
  );
};
export default Asta;
