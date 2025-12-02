import { Button, Container, Form } from "react-bootstrap";
import Griglia from "./griglia";
import Searchbar from "./searchbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { GetAstaByIdAction } from "../redux/actions/getAstaByIdActions";
import SockJS from "sockjs-client";
import Stomp, { over } from "stompjs";
import { getAstaCalciatoreById } from "../redux/actions/getAstaCalciatoreByid";
import { astaTerminataAction } from "../redux/actions/astaTerminataAction";
import { addUserToAstaAction } from "../redux/actions/addUserToAstaAction";
import { ChatFill, Messenger, Send, X } from "react-bootstrap-icons";
import SignInButton from "./signInButton";
import RegisterButton from "./registerButton";
import PillNav from "./PillNav/PillNav";
//METODO PER DOWNLOAS ED ESPORTAZIONE ROSE ASTA
const downloadCsv = (data, filename = "acquisti.csv") => {
  if (data.length === 0) {
    alert("Nessun giocatore acquistato da esportare.");
    return;
  }
  //STABILISCO LE INTESTAZIONI DELLE COLONNE DEL FILE CSV
  const headers = [
    "Utente",
    "Ruolo",
    "Nome Giocatore",
    "Prezzo Acquisto (FM)",
    "Percentuale Budget Spesa",
  ];

  const csvData = data.map((acquisto) => {
    return (
      [
        acquisto["Utente"],
        acquisto["Ruolo"],
        acquisto["Nome Giocatore"],
        acquisto["Prezzo Acquisto (FM)"],
        acquisto["Percentuale Budget Spesa"],
      ]
        .map((value) => {
          let stringValue = String(value);
          //PER EVITARE CONFLITTI DATI DALLE VIRGOLE SE NELLA STRINGA è PRESENTE , " \n LE SOSTITUISCO CON DOPPIE VIRGOLETTE
          if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
          ) {
            stringValue = `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        //AGGIUNGO VIRGOLA PER FILE CSV
        .join(",")
    );
  });

  const csvString = [headers.join(","), ...csvData].join("\n");
  //CREO FILE TEMPORANEO
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
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
  const [messaggi, setMessaggi] = useState([]);
  const [messaggio, setMessaggio] = useState("");
  const nickname = user?.username;

  //Qui inizia la sottoscrizione del client al WebSocket
  useEffect(() => {
    //Se dettagliAstaRecuperata?.id o user?.id non sono presenti fermo subito l'esecuzione
    if (!dettagliAstaRecuperata?.id || !user?.id) return;
    //Passato il controllo definisco un nuovo SockJS indicando l'endpoint definito nella configurazione del WS nel Back-End
    const socket = new SockJS("rich-del-davide-mancini-9aa8ac64.koyeb.app/ws");
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
      client.subscribe(`/topic/messages/${astaId}`, (message) => {
        const messaggioRicevuto = JSON.parse(message.body);
        console.log("messaggio ricevuto", messaggioRicevuto);
        setMessaggi((prevMessaggi) => [...prevMessaggi, messaggioRicevuto]);
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

        console.log("Invio messaggio utente-entrato:", payload);
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
  const sendOfferta = (valoreDiretto = null) => {
    const valoreFinale = valoreDiretto !== null ? valoreDiretto : offerta;
    //Verifica prima di proseguire
    if (!stompClient || !stompClient.connected) {
      console.log("Stomp non connesso");
      return;
    }

    console.log("ECCO ID ASTA", astaCalciatore?.id);
    //Se sia l'offerta che l'username che l'id dell'asta calciatore sono settati allora posso creare l'offerta dell'asta, composta dall'offerta, l'id dell'utente che fa l'offerta e l'id dell'asta calciatore
    if (valoreFinale && username && astaCalciatore) {
      const offertaAsta = {
        valoreOfferta: valoreFinale,
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

  //SALVO TUTTE LE ROSE QUI
  const [tutteLeRose, setTutteLeRose] = useState({});
  //FUNZIONE PER AGGIORNATE LE ROSE
  //USECALLBACK MEMOIZZA UNA FUNZIONE IN MODO CHE NON VENGA RICREATA AD OGNI RENDER MOLTO UTILE PER OTTIMIZZARE
  const handleRosaUpdate = useCallback((idUtente, datiRosa) => {
    setTutteLeRose((prev) => ({
      ...prev,
      [idUtente]: datiRosa,
    }));
  }, []);

  //FUNZIONE CHE PASSO COME PROPS CHE VERRA SCATENATA AL CLICK DEL BOTTONE SU SEARCHBAR
  const handleExportCsv = () => {
    //OBJECT VALUES RESTITUISCE SOLTANTO I VALORE SENZA LE CHIAVI, FLAT APPIATTISCE GLI ARRAY DI ARRAY IN UN SINGOLO ARRAY
    const tuttiGliAcquisti = Object.values(tutteLeRose).flat();
    //VERIFICO CHE NON SIA VUOTO
    if (tuttiGliAcquisti.length > 0) {
      const astaNome = dettagliAstaRecuperata?.nome_asta || "sessione";
      const timestamp = new Date().toISOString().slice(0, 10);
      //RICHIAMO LA FUNZIONE CREATA SOPRA PASSANDOGLI IL NOME DEL FILE
      downloadCsv(tuttiGliAcquisti, `rosa_asta_${astaNome}_${timestamp}.csv`);
    } else {
      //SE CLICCO SUL PULSANTE MA IL FILE è VUOTO INVIA ALERT
      alert("Nessun giocatore acquistato da esportare.");
    }
  };
  const [mostraChat, setMostraChat] = useState(false);
  const handleMessaggio = (e) => {
    setMessaggio(e.target.value);
  };
  const sendMessaggio = () => {
    if (messaggio.trim()) {
      const chatMessage = {
        nickname,
        content: messaggio,
        immagine: user?.avatar,
      };
      stompClient.send(
        `/app/chat/${dettagliAstaRecuperata.id}`,
        {},
        JSON.stringify(chatMessage)
      );
    }
    setMessaggio("");
  };
  return (
    <>
      <Container fluid>
        {user ? (
          <>
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
              handleExportCsv={handleExportCsv}
              tutteLeRose={tutteLeRose}
            />
            <Griglia onRosaUpdate={handleRosaUpdate} />
            <div className=" d-flex flex-row-reverse sticky-bottom">
              <Button
                onClick={() => {
                  setMostraChat(true);
                }}
                className=" mb-3"
              >
                <ChatFill />
              </Button>
            </div>
            {mostraChat && (
              <div className=" d-flex flex-row-reverse sticky-bottom">
                <div className=" bg-light rounded-3 mb-3">
                  <div
                    style={{ height: "300px" }}
                    className=" bg-light rounded-3 "
                  >
                    <div className=" d-flex flex-row-reverse border rounded-3 border-light bg-dark ">
                      <X
                        className=" text-danger fs-5"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setMostraChat(false);
                        }}
                      />
                      <h4 className=" mx-auto text-warning">Chat</h4>
                    </div>
                    <ul
                      className=" d-flex flex-column ps-0 ms-1 mt-3 text-dark"
                      style={{ width: "250px" }}
                    >
                      {messaggi.map((mex, index) => (
                        <li
                          key={index}
                          className=" d-flex w-100 my-1 border-bottom pb-1"
                        >
                          <img
                            src={mex.immagine}
                            alt=""
                            className=" rounded-pill me-1 "
                            style={{ width: "20px", height: "20px" }}
                          />
                          <small className=" fw-bold me-1">
                            {mex.nickname}:
                          </small>
                          <small className=" m-0 ">{mex.contenuto}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className=" d-flex align-items-center">
                    <Form.Control
                      value={messaggio}
                      placeholder="Scrivi messaggio"
                      className=" shadow-none ms-2 my-2"
                      onChange={handleMessaggio}
                    ></Form.Control>
                    <Send
                      className=" fs-4 mx-2 text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={sendMessaggio}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className=" d-flex justify-content-center">
              {/* NAVBAR DI REACT BITS */}
              <PillNav
                logo={"src/assets/fire.svg"}
                logoAlt="Company Logo"
                items={[
                  { label: "ASTA", href: "/impostazioni-asta" },
                  { label: "STRATEGIA", href: "/strategia" },
                  { label: "CAMPETTO", href: "/campetto" },
                  { label: "PROFILO", href: "#" },
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
            <div className=" h-100 text-warning d-flex justify-content-center align-items-center flex-column">
              <h3>Per entrare nell'asta devi effettuare l'accesso</h3>
              <div>
                <SignInButton />
                <RegisterButton />
              </div>
            </div>
          </>
        )}
        {/* Passo le mie funzioni alla search bar tramite props */}
      </Container>
    </>
  );
};
export default Asta;
