import futsal from "@/assets/cancha-futsal.jpg";
import tenis from "@/assets/cancha-tenis.jpg";
import basquet from "@/assets/cancha-basquet.jpg";
import padel from "@/assets/cancha-padel.jpg";
import voley from "@/assets/cancha-voley.jpg";
import futbol7 from "@/assets/cancha-futbol7.jpg";

export type Deporte = "Fútbol" | "Futsal" | "Tenis" | "Básquet" | "Pádel" | "Vóley";

export interface Cancha {
  id: string;
  nombre: string;
  deporte: Deporte;
  ubicacion: string;
  precioHora: number;
  imagen: string;
  capacidad: string;
  superficie: string;
  techada: boolean;
  rating: number;
}

// Datos de ejemplo para la primera versión visual.
export const canchas: Cancha[] = [
  {
    id: "estadio-norte-f7",
    nombre: "Estadio Norte F7",
    deporte: "Fútbol",
    ubicacion: "Av. Los Andes 1450, Zona Norte",
    precioHora: 180,
    imagen: futbol7,
    capacidad: "14 jugadores",
    superficie: "Césped sintético",
    techada: false,
    rating: 4.8,
  },
  {
    id: "arena-futsal-centro",
    nombre: "Arena Futsal Centro",
    deporte: "Futsal",
    ubicacion: "Calle Comercio 220, Centro",
    precioHora: 150,
    imagen: futsal,
    capacidad: "10 jugadores",
    superficie: "Parquet sintético",
    techada: true,
    rating: 4.9,
  },
  {
    id: "club-tenis-arcilla",
    nombre: "Club Tenis Arcilla",
    deporte: "Tenis",
    ubicacion: "Paseo del Parque 88, Sopocachi",
    precioHora: 120,
    imagen: tenis,
    capacidad: "4 jugadores",
    superficie: "Polvo de ladrillo",
    techada: false,
    rating: 4.7,
  },
  {
    id: "duela-urbana",
    nombre: "Duela Urbana",
    deporte: "Básquet",
    ubicacion: "Costanera Sur 510, Calacoto",
    precioHora: 100,
    imagen: basquet,
    capacidad: "10 jugadores",
    superficie: "Acrílico deportivo",
    techada: false,
    rating: 4.6,
  },
  {
    id: "padel-point",
    nombre: "Pádel Point",
    deporte: "Pádel",
    ubicacion: "Av. Ballivián 1020, Obrajes",
    precioHora: 140,
    imagen: padel,
    capacidad: "4 jugadores",
    superficie: "Césped de pádel",
    techada: false,
    rating: 4.9,
  },
  {
    id: "playa-voley-sur",
    nombre: "Playa Vóley Sur",
    deporte: "Vóley",
    ubicacion: "Complejo Laguna Azul, Zona Sur",
    precioHora: 90,
    imagen: voley,
    capacidad: "12 jugadores",
    superficie: "Arena fina",
    techada: false,
    rating: 4.5,
  },
];

export const deportes: Deporte[] = ["Fútbol", "Futsal", "Tenis", "Básquet", "Pádel", "Vóley"];

export function getCancha(id: string): Cancha | undefined {
  return canchas.find((c) => c.id === id);
}
