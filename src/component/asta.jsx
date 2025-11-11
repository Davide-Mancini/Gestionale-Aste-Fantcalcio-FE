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
import { getAstaCalciatoreById } from "../redux/actions/getAstaCalciatoreByid";

const Asta = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const dettagliAstaRecuperata = useSelector((state) => state.astaById.asta);

  //DEVO RECUPERARE L'ASTA GIOCATORE TRAMITE ID NON SESSIONE ASTA
  const astaCalciatoreRecuperata = useSelector((state) => state.astaCalciatore);
  useEffect(() => {
    if (astaCalciatoreRecuperata) {
      console.log("Valore aggiornato:", astaCalciatoreRecuperata);
      // qui puoi fare quello che ti serve
    }
  }, [astaCalciatoreRecuperata]);

  // useEffect(() => {
  //   dispatch(getAstaCalciatoreById(astaCalciatoreRecuperata.id));
  // }, [astaCalciatoreRecuperata]);
  console.log("asta calciatore recuperata= ", astaCalciatoreRecuperata);
  // console.log("rotta id" + id);
  // console.log("dettagli atsa:" + JSON.stringify(dettagliAstaRecuperata));
  useEffect(() => {
    if (id) {
      console.log("id del dispatch" + id);
      dispatch(GetAstaByIdAction(id));
    }
  }, [id, dispatch]);
  console.log("dopo dipsatch" + JSON.stringify(dettagliAstaRecuperata));

  // const [offerte, setOfferte] = useState([]);
  const [offerta, setOfferta] = useState(0);
  const [username, setUsername] = useState("");
  const user = useSelector((state) => {
    return state.signIn.user;
  });
  console.log(`/topic/public/${dettagliAstaRecuperata?.id}`);
  console.log(user);
  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);
  const [stompClient, setStompClient] = useState(null);
  const [offertaAttuale, setOffertaAttuale] = useState(1);
  console.log(username);
  console.log(offerta);
  // console.log(offerte);
  useEffect(() => {
    if (!dettagliAstaRecuperata?.id || !user?.id) return;

    const socket = new SockJS("http://localhost:3001/ws");
    const client = over(socket);

    // Attiva debug STOMP
    client.debug = (str) => console.log("STOMP: " + str);

    client.connect({}, (frame) => {
      console.log("WebSocket connesso:", frame);

      const astaId = dettagliAstaRecuperata.id;

      client.subscribe(`/topic/public/${astaId}`, (message) => {
        console.log("primo messaggio", message);
        const offertaRicevuta = JSON.parse(message.body);
        console.log("OFFERTA RICEVUTA:", offertaRicevuta);
        setOffertaAttuale(offertaRicevuta.valoreOfferta);
      });
    });

    setStompClient(client);

    return () => {
      if (client && client.connected) {
        client.disconnect();
        console.log("WebSocket disconnesso");
      }
    };
  }, [dettagliAstaRecuperata?.id, user?.id]);

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
    const astaCalciatoreId = astaCalciatoreRecuperata?.asta.id;
    console.log("ECCO ID ASTA", astaCalciatoreId);
    if (offerta && username) {
      const offertaAsta = {
        valoreOfferta: offerta,
        offerente: user?.id,
        asta: astaCalciatoreId,
      };
      console.log("offerta asta", offertaAsta);
      stompClient.send(
        `/app/inviaofferta/${dettagliAstaRecuperata.id}`,
        {},
        JSON.stringify(offertaAsta)
      );
      setOffertaAttuale(offertaAsta.valoreOfferta);
      console.log(offertaAsta.valoreOfferta);
    } else {
      console.log("inserire nickname e offerta");
    }
  };

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
          getAstaId={getAstaCalciatoreById}
        />
        <Griglia />
      </Container>
    </>
  );
};
export default Asta;
