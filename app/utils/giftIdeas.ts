export interface GiftIdea {
  name: string;
  image: string;
}

const giftIdeas: GiftIdea[] = [
  { name: "Set de Cocina Gourmet", image: "/placeholder.svg?height=100&width=100" },
  { name: "Libro Electrónico", image: "/placeholder.svg?height=100&width=100" },
  { name: "Auriculares Inalámbricos", image: "/placeholder.svg?height=100&width=100" },
  { name: "Kit de Jardinería", image: "/placeholder.svg?height=100&width=100" },
  { name: "Cámara Instantánea", image: "/placeholder.svg?height=100&width=100" },
  { name: "Juego de Mesa Familiar", image: "/placeholder.svg?height=100&width=100" },
];

export function generateGiftIdeas(count: number = 3): GiftIdea[] {
  const shuffled = [...giftIdeas].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

