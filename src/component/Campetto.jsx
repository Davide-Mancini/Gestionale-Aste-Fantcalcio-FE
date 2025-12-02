import { Col, Container, Row } from "react-bootstrap";
import PillNav from "./PillNav/PillNav";
import "../style/Campo.css";
import LogoLoop from "./LogoLoop/LogoLoop";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewsAction } from "../redux/actions/getNewsActions";
const Campetto = () => {
  const imageLogos = [
    {
      src: "/Logo_Atalanta_Bergamo.svg.png",
      alt: "Company 2",
      href: "https://www.legaseriea.it/it/team/atalanta",
    },
    {
      src: "/Bologna_F.C._1909_logo.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/bologna",
    },
    {
      src: "/Cagliari_calcio.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/cagliari",
    },
    {
      src: "/Calcio_Como_-_logo_(Italy,_2019-).svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/como",
    },
    {
      src: "/Unione_Sportiva_Cremonese_logo.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/cremonese",
    },
    {
      src: "/ACF_Fiorentina_-_logo_(Italy,_2022).svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/fiorentina",
    },
    {
      src: "/Genoa_Cricket_and_Football_Club_logo.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/genoa",
    },
    {
      src: "/Hellas_Verona_FC_logo_(2020).svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/hellas-verona",
    },
    {
      src: "/Inter_Milano_2021_logo_with_2_stars.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/inter",
    },
    {
      src: "/Juventus_FC_2017_logo.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/juventus",
    },
    {
      src: "/Stemma_della_Società_Sportiva_Lazio.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/lazio",
    },
    {
      src: "/US_Lecce_Stemma.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/lecce",
    },
    {
      src: "/Logo_of_AC_Milan.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/milan",
    },
    {
      src: "/SSC_Neapel.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/napoli",
    },
    {
      src: "/Logo_Parma_Calcio_1913_(adozione_2016).svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/parma",
    },
    {
      src: "/Logo_Pisa_SC_2017.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/pisa",
    },
    {
      src: "/AS_Roma_Logo_2017.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/roma",
    },
    {
      src: "/Ussassuolostemma.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/sassuolo",
    },
    {
      src: "/Torino_FC_logo.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/torino",
    },
    {
      src: "/Logo_Udinese_Calcio_2010.svg.png",
      alt: "Company 3",
      href: "https://www.legaseriea.it/it/team/udinese",
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNewsAction());
  }, []);

  const news = useSelector((state) => {
    return state.news.news;
  });
  return (
    <>
      <Container fluid className=" bg-dark ">
        <div className=" d-flex justify-content-center">
          <PillNav
            logo={"/fire.svg"}
            logoAlt="Company Logo"
            items={[
              { label: "ASTA", href: "/impostazioni-asta" },
              { label: "STRATEGIA", href: "/strategia" },
              { label: "NOTIZIE", href: "/campetto" },
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
        <Row>
          <div
            style={{
              height: "100px",
              position: "relative",
              overflow: "hidden",
              marginTop: "80px",
            }}
            className=" mx-0 p-0"
          >
            {/* Basic horizontal loop */}
            <LogoLoop
              logos={imageLogos}
              speed={100}
              direction="left"
              logoHeight={50}
              gap={40}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#212529"
              ariaLabel="Technology partners"
            />
          </div>
          <Col
            xs={12}
            md={3}
            className=" d-flex align-items-center flex-column"
          >
            <div className=" border border-3 border-warning rounded-4 w-75 mb-3">
              <h1 className=" text-center text-light fw-bold">Classifica</h1>
            </div>
            <iframe
              id="sofa-standings-embed-33-76457"
              src="https://widgets.sofascore.com/it/embed/tournament/33/season/76457/standings/Serie%20A%2025%2F26?widgetTitle=Serie%20A%2025%2F26&showCompetitionLogo=true"
              style={{ height: "1123px", maxWidth: "308px" }}
            ></iframe>
          </Col>
          <Col xs={12} md={6}>
            <div className=" border border-warning border-3 rounded-4 mb-3">
              <h1
                className=" text-light fw-bold m-0 text-center"
                style={{ fontSize: "5em" }}
              >
                ULTIME NOTIZIE
              </h1>
            </div>
            {news.map((notizia) => (
              <div className=" d-flex flex-row text-light ">
                <img
                  src={notizia?.thumbnail}
                  alt=""
                  className=" w-50 object-fit-contain p-2  "
                />
                <div className=" p-2">
                  <h3>{notizia?.title}</h3>
                  <p>{notizia?.description}</p>
                </div>
              </div>
            ))}
          </Col>
          <Col xs={12} md={3}>
            <div className=" border border-3 border-warning rounded-4 mb-3">
              <h1 className=" fw-bold text-light text-center">Migliori 11</h1>
            </div>
            <iframe
              id="sofa-totw-embed-23-76457-22822"
              width="100%"
              height="598"
              style={{ display: "block", maxWidth: "700px" }}
              src="https://widgets.sofascore.com/it/embed/unique-tournament/23/season/76457/round/22822/teamOfTheWeek?showCompetitionLogo=true&widgetTheme=light&widgetTitle=Serie%20A"
            ></iframe>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Campetto;
