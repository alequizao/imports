import type { Product } from '@/lib/types';

// Estes são dados iniciais que podem ser usados para popular um banco de dados.
// Em uma aplicação com banco de dados, esta lista seria carregada no banco
// e não usada diretamente pelo frontend ou store após a inicialização.
export const initialSeedProducts: Product[] = [
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
  },
];

export const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
