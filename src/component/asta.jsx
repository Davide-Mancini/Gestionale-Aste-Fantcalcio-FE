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
import { getAstaCalciatoreById } from "../redux/actions/getAstaCalciatoreByid";
import { astaTerminataAction } from "../redux/actions/astaTerminataAction";
import { addUserToAstaAction } from "../redux/actions/addUserToAstaAction";
import PillNav from "./PillNav/PillNav";

const Asta = () => {
  // dichiaro dispatch per poter usare lo useDispatch
  const dispatch = useDispatch();
  //Recupero l'id dall'url
  const { id } = useParams();
  //Se ID è presente faccio il dispatch dell'action che recupera l'asta con l'id passandogli l'id sopra
  useEffect(() => {
    if (id) {
      console.log("id del dispatch" + id);
      dispatch(GetAstaByIdAction(id));
    }
  }, [id, dispatch]);
  //Recupero i dettagli dell'asta dallo store di redux
  const dettagliAstaRecuperata = useSelector((state) => state.astaById.asta);
  console.log("Dettagli Asta:", dettagliAstaRecuperata);
  console.log("Utenti nella sessione:", dettagliAstaRecuperata?.utenti);
  useEffect(() => {
    console.log("dettagliAstaRecuperata cambiato:", dettagliAstaRecuperata);
  }, [dettagliAstaRecuperata]);
  //Recupero asta calciatore sempre dallo stato di redux, all'inizio sarà undefined, solo dopo il click sul bottone "inizia asta" sara presente
  // const astaCalciatoreRecuperata = useSelector((state) => state.astaCalciatore);
  // useEffect(() => {
  //   if (astaCalciatoreRecuperata) {
  //     console.log("Valore aggiornato:", astaCalciatoreRecuperata);
  //   }
  // }, [astaCalciatoreRecuperata]);
  //Setto stato locale per offerta e username
  const [offerta, setOfferta] = useState(0);
  console.log("Offertaaaa", offerta);
  const [username, setUsername] = useState("");
  //Recupero l'utente dallo stato di redux
  const user = useSelector((state) => {
    return state.signIn.user;
  });
  //Verifico che user è presente, se presente setto il mio stato locale di username con il suo username dal DB
  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);
  //Inizio ad impostare il mio WebSocket definendo stato locale per stompClient
  const [stompClient, setStompClient] = useState(null);
  const [offertaAttuale, setOffertaAttuale] = useState(0);
  const [astaCalciatore, setAstaCalciatore] = useState(null);
  const [offerente, setOfferente] = useState(null);
  console.log("ASTAAAAA", astaCalciatore);
  //Qui inizia la sottoscrizione del client al WebSocket
  useEffect(() => {
    //Se dettagliAstaRecuperata?.id o user?.id non sono presenti fermo subito l'esecuzione
    if (!dettagliAstaRecuperata?.id || !user?.id) return;
    //Passato il controllo definisco un nuovo SockJS indicando l'endpoint definito nella configurazione del WS nel Back-End
    const socket = new SockJS("http://localhost:3001/ws");
    const client = over(socket);
    client.debug = (str) => console.log("STOMP: " + str);
    //Effettua la connessione
    client.connect({}, (frame) => {
      console.log("WebSocket connesso:", frame);
      //Salvo l'id dell'asta in una nuova costante
      const astaId = dettagliAstaRecuperata.id;
      //Passo la costante nell'endpoint per l'iscrizione al ws
      client.subscribe(`/topic/public/${astaId}`, (message) => {
        console.log("primo messaggio", message);
        const offertaRicevuta = JSON.parse(message.body);
        console.log("OFFERTA RICEVUTA:", offertaRicevuta);
        setOffertaAttuale(offertaRicevuta.valoreOfferta);
        setOfferente(offertaRicevuta.offerente);
        setAstaCalciatore((prev) => ({
          ...prev,
          dataInizio: offertaRicevuta.inizioAsta,
        }));
      });
      client.subscribe(`/topic/calciatore-selezionato/${astaId}`, (message) => {
        const calciatore = JSON.parse(message.body);
        console.log("Calciatore selezionato da altri:", calciatore);
        setCalciatoreSelezionato(calciatore);
      });
      client.subscribe(
        `/topic/asta-iniziata/${dettagliAstaRecuperata.id}`,
        (message) => {
          const nuovaAsta = JSON.parse(message.body);
          console.log("Asta iniziata per tutti:", nuovaAsta);
          setAstaCalciatore(nuovaAsta);
        }
      );
      client.subscribe(`/topic/utente-entrato/${astaId}`, (message) => {
        const utenteEntrato = JSON.parse(message.body);
        console.log("Utente entrato:", utenteEntrato);
        dispatch(addUserToAstaAction(utenteEntrato));
      });
      // dispatch(addUserToAstaAction(astaId, user.id));
      if (!astaCalciatore?.id) return;
      client.subscribe(
        `/topic/asta-terminata/${astaCalciatore.id}`,
        (message) => {
          const data = JSON.parse(message.body);
          dispatch(astaTerminataAction(data));
          dispatch(setAstaCalciatore(null));
          console.log("ASTA TERMINATA RICEVUTA:", data);
          if (data.sessioneAstaId === dettagliAstaRecuperata.id) {
            alert(
              `${data.calciatore} assegnato a ${data.vincitore} per ${data.prezzo} crediti!`
            );
          }
        }
      );
    });

    setStompClient(client);
    setTimeout(() => {
      if (client.connected) {
        const payload = {
          id: user.id,
          username: user.username,
        };

        console.log("🚀 Invio messaggio utente-entrato:", payload);
        client.send(
          `/app/utente-entrato/${dettagliAstaRecuperata.id}`,
          {},
          JSON.stringify(payload)
        );
      } else {
        console.error("Client non ancora connesso dopo timeout");
      }
    }, 100);

    return () => {
      if (client && client.connected) {
        client.disconnect();
        console.log("WebSocket disconnesso");
      }
    };
  }, [dettagliAstaRecuperata?.id, user?.id, astaCalciatore?.id, dispatch]);

  //Funzioni per gestire le offerte
  const handleOfferta1 = () => {
    setOfferta(offertaAttuale + 1);
  };
  const handleOfferta5 = () => {
    setOfferta(offertaAttuale + 5);
  };
  const handleOfferta10 = () => {
    setOfferta(offertaAttuale + 10);
  };
  const azzeraOfferta = () => {
    setOffertaAttuale(0);
  };
  //Invio dell'offerta tramite stomp
  const sendOfferta = () => {
    //Verifica prima di proseguire
    if (!stompClient || !stompClient.connected) {
      console.log("Stomp non connesso");
      return;
    }

    console.log("ECCO ID ASTA", astaCalciatore?.id);
    //Se sia l'offerta che l'username che l'id dell'asta calciatore sono settati allora posso creare l'offerta dell'asta, composta dall'offerta, l'id dell'utente che fa l'offerta e l'id dell'asta calciatore
    if (offerta && username && astaCalciatore) {
      const offertaAsta = {
        valoreOfferta: offerta,
        offerente: user?.id,
        asta: astaCalciatore.id,
      };
      //Invio dell'offerta al Back-End
      stompClient.send(
        `/app/inviaofferta/${dettagliAstaRecuperata.id}`,
        {},
        JSON.stringify(offertaAsta)
      );
      //Setto l'offerta attuale con il valore dell'offerta appena fatta
      setOffertaAttuale(offertaAsta.valoreOfferta);
    } else {
      console.log("Inserire nickname e offerta");
    }
  };
  //Qui viene aggiunto l'utente alla lista degli utenti di quella specifica asta
  // useEffect(() => {
  //   // Aspetta che TUTTO sia pronto
  //   if (
  //     !stompClient?.connected ||
  //     !user?.id ||
  //     !dettagliAstaRecuperata?.id ||
  //     !dettagliAstaRecuperata?.utenti
  //   ) {
  //     return;
  //   }

  //   // Verifica se l'utente è già nella lista
  //   const utenteGiaPresente = dettagliAstaRecuperata.utenti.some(
  //     (u) => u.id === user.id
  //   );

  //   if (utenteGiaPresente) {
  //     console.log("Utente già presente nell'asta");
  //     return;
  //   }

  //   const payload = {
  //     id: user.id,
  //     username: user.username,
  //   };

  //   console.log("Invio messaggio utente-entrato", payload);
  //   stompClient.send(
  //     `/app/utente-entrato/${dettagliAstaRecuperata.id}`,
  //     {},
  //     JSON.stringify(payload)
  //   );
  // }, [stompClient?.connected, user?.id, dettagliAstaRecuperata]);
  const [calciatoreSelezionato, setCalciatoreSelezionato] = useState({});
  const handleSelezionaCalciatore = (calciatore) => {
    if (!stompClient?.connected) return;

    const payload = {
      id: calciatore.id,
      nomeCompleto: calciatore.nome_completo,
      immagineUrl: calciatore.campioncino,
      valoreBase: 1,
    };
    stompClient.send(
      `/app/selezionaCalciatore/${dettagliAstaRecuperata.id}`,
      {},
      JSON.stringify(payload)
    );
    setCalciatoreSelezionato(payload);
  };

  const handleIniziaAsta = () => {
    if (!stompClient?.connected || !calciatoreSelezionato) return;

    const payload = {
      calciatoreId: calciatoreSelezionato.id,
      astaId: dettagliAstaRecuperata.id,
    };

    stompClient.send(
      `/app/iniziaAsta/${dettagliAstaRecuperata.id}`,
      {},
      JSON.stringify(payload)
    );
  };
  const handleFineAsta = () => {
    if (!stompClient?.connected) return;
    if (!astaCalciatore?.id) {
      console.error("AstaCalciatore NON PRONTO");
      return;
    }
    stompClient.send(
      `/app/termina-asta/${astaCalciatore.id}`,
      {},
      JSON.stringify({})
    );
  };

  return (
    <>
      <Container fluid>
        {/* Passo le mie funzioni alla search bar tramite props */}
        <Searchbar
          offertaAttuale={offertaAttuale}
          azzeraOfferta={azzeraOfferta}
          offerta1={handleOfferta1}
          offerta5={handleOfferta5}
          offerta10={handleOfferta10}
          sendOfferta={sendOfferta}
          getAstaId={getAstaCalciatoreById}
          calciatoreSelezionato={calciatoreSelezionato}
          handleSelezionaCalciatore={handleSelezionaCalciatore}
          handleIniziaAsta={handleIniziaAsta}
          astaCalciatore={astaCalciatore}
          offerente={offerente}
          handleFineAsta={handleFineAsta}
          dettagliAstaRecuperata={dettagliAstaRecuperata}
        />
        <Griglia />
      </Container>
    </>
  );
};
export default Asta;
