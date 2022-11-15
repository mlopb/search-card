import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";

const MiApi = () => {
  const [busqueda, setBusqueda] = useState("");
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    fetchFoundCards("");
  }, []);

  const capturaBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const fetchFoundCards = async (cardSearched) => {
    cardSearched = cardSearched.replace(" ", "+");
    let res;
    if (cardSearched) {
      res = await fetch(
        `https://api.scryfall.com/cards/search?order=name&q=${cardSearched}+lang=en`
      );
    } else {
      res = await fetch(
        `https://api.scryfall.com/cards/search?order=rarity&q=e%3Admu`
      );
    }

    const foundCards = await res.json();
    let cardsData = [];

    await foundCards.data.forEach((card) => {
      let cardText;
      let imagePath;
      let edition;
      let rarity;
      let name;
      let cardData = {};
      let collectorNumber;
      let identifier;

      if (card.card_faces) {
        imagePath = card.card_faces[0].image_uris.normal;
        name = card.name.split(" //")[0];
        cardText = card.card_faces[0].oracle_text;
        collectorNumber = card.collector_number;
      } else {
        imagePath = card.image_uris.normal;
        name = card.name;
        cardText = card.oracle_text;
        collectorNumber = card.collector_number;
      }

      identifier = card.id;
      edition = card.set_name;
      rarity = card.rarity;

      cardData = {
        imagePath,
        identifier,
        edition,
        rarity,
        cardText,
        name,
        collectorNumber,
      };
      cardsData.push(cardData);
    });
    setCards(cardsData);
    setFilteredCards(cardsData);
  };

  const enviarBusqueda = async (e) => {
    e.preventDefault();
    console.log(busqueda);
    const listaFiltrada = cards.filter((el) =>
      el.name.toLowerCase().includes(busqueda.toLowerCase())
    );
    // Sort de cartas por numero
    listaFiltrada.sort(function (a, b) {
      return a.collectorNumber - b.collectorNumber;
    });
    setFilteredCards(listaFiltrada);
    console.log(listaFiltrada);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Buscador de Cartas Magic</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            ></Nav>
            <Form className="d-flex" onSubmit={enviarBusqueda}>
              <Form.Control
                type="search"
                placeholder="Ingresa carta"
                className="me-2"
                aria-label="Search"
                onChange={capturaBusqueda}
              />
            </Form>
            <form onSubmit={enviarBusqueda}>
              <Button variant="outline-success" type="submit">
                Buscar
              </Button>
            </form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="items-found-container ">
        {filteredCards.map((card) => (
          <div className="items-found">
            <div className="card-img">
              <img src={card.imagePath} alt="Found Card" />
            </div>
            <div className="item-name">{card.name}</div>
            <div className="item-price">Edición: {card.edition}</div>
            <div className="item-price">Numero {card.collectorNumber}</div>
            <div className="item-price">Rareza: {card.rarity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MiApi;
