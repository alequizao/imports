import type { Product } from '@/lib/types';

// These are initial seed products for reference or manual seeding if needed.
// The application's product store will initialize empty if no data is found in localStorage.
export const referenceSeedProducts: Product[] = [
  {
    id: '1',
    name: 'Perfume Importado Alpha',
    description: 'Uma fragrância marcante para homens modernos e sofisticados. Notas amadeiradas e cítricas.',
    price: 349.90,
    image: 'https://picsum.photos/seed/perfumeA/400/300',
    category: 'Perfumes',
    color: 'Transparente',
    size: '100ml',
    model: 'Alpha Pour Homme',
    stock: 15,
    reviews: [
      { id: 'rev1_1', author: 'Carlos M.', rating: 5, comment: 'Excelente! Fixação duradoura e aroma sofisticado.', date: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 'rev1_2', author: 'Beatriz L.', rating: 4, comment: 'Muito bom, mas um pouco forte para o meu gosto pessoal.', date: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
  },
  {
    id: '2',
    name: 'Tênis Esportivo BoostX',
    description: 'Conforto e performance para suas corridas. Tecnologia de amortecimento avançada.',
    price: 599.00,
    image: 'https://picsum.photos/seed/sneakerX/400/300',
    category: 'Calçados',
    color: 'Preto/Branco',
    size: '42 BR',
    model: 'BoostX Runner',
    stock: 8,
    reviews: [],
  },
  {
    id: '3',
    name: 'Relógio Clássico Elegance',
    description: 'Design atemporal com pulseira de couro genuíno e mostrador minimalista.',
    price: 780.50,
    image: 'https://picsum.photos/seed/watchE/400/300',
    category: 'Acessórios',
    color: 'Prata com pulseira Marrom',
    size: 'Único',
    model: 'Elegance Timepiece',
    stock: 12,
    reviews: [
      { id: 'rev3_1', author: 'Fernanda S.', rating: 5, comment: 'Lindo e elegante, superou minhas expectativas!', date: new Date(Date.now() - 86400000 * 10).toISOString() },
    ],
  },
  {
    id: '4',
    name: 'Fone de Ouvido ProSound',
    description: 'Qualidade de som imersiva com cancelamento de ruído ativo. Ideal para música e chamadas.',
    price: 450.00,
    image: 'https://picsum.photos/seed/headphonesP/400/300',
    category: 'Eletrônicos',
    color: 'Preto Fosco',
    size: 'Ajustável',
    model: 'ProSound Elite',
    stock: 0, // Out of stock example
    reviews: [],
  },
  {
    id: '5',
    name: 'Bolsa de Couro Lux',
    description: 'Elegância e praticidade em uma bolsa espaçosa feita com couro de alta qualidade.',
    price: 620.00,
    image: 'https://picsum.photos/seed/leatherBag/400/300',
    category: 'Acessórios',
    color: 'Caramelo',
    size: 'Média',
    model: 'Lux Tote',
    stock: 7,
    reviews: [],
  },
  {
    id: '6',
    name: 'Óculos de Sol Aviador Prime',
    description: 'Proteção UV400 com estilo clássico aviador. Lentes polarizadas.',
    price: 289.99,
    image: 'https://picsum.photos/seed/sunglassesV/400/300',
    category: 'Acessórios',
    color: 'Dourado com lentes Verdes',
    size: 'Único',
    model: 'Prime Aviators',
    stock: 20,
    reviews: [],
  },
];

export const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
