import manzanas from "../assets/img/manzanasfuji.jpg";
import naranjas from "../assets/img/naranja.jpg";
import platanos from "../assets/img/platanos.jpg";
import pomelo from "../assets/img/pomelo.jpg";
import aguacate from "../assets/img/aguacate.jpg";
import mango from "../assets/img/mango.jpg";

const productos = [
  {
    id: "FR001",
    nombre: "Manzanas Fuji",
    precio: 1200,
    stock: 150,
    categoria: "Frutas",
    img: manzanas,
    descripcion:
      "Manzanas Fuji crujientes y dulces.",
  },
  {
    id: "FR002",
    nombre: "Naranjas",
    precio: 1000,
    stock: 200,
    categoria: "Frutas",
    img: naranjas,
    descripcion:
      "Jugosas y ricas en vitamina C.",
  },
  {
    id: "FR003",
    nombre: "Plátanos ",
    precio: 800,
    stock: 250,
    categoria: "Frutas",
    img: platanos,
    descripcion:
      "Plátanos maduros y dulces.",
  },
  {
    id: "FR004",
    nombre: "Pomelo",
    precio: 2150,
    stock: 50,
    categoria: "Frutas",
    img: pomelo,
    descripcion:
      "Pomelo fresco y jugoso.",
  },
  {
    id: "FR005",
    nombre: "Palta",
    precio: 6290,
    stock: 50,
    categoria: "Frutas",
    img: aguacate,
    descripcion:
      "Palta fresca y cremosa.",
  },
  {
    id: "FR006",
    nombre: "Mango",
    precio: 2990,
    stock: 50,
    categoria: "Frutas",
    img: mango,
    descripcion:
      "Mango fresco y jugoso.",
  },
];

export default productos;