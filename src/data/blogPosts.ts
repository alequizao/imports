
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO Date string
  excerpt: string;
  content: string; // Markdown or HTML content
  author: string;
  category?: string;
  tags?: string[];
  imageUrl?: string; // Optional image for the post
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'novidades-da-semana-perfumes',
    title: 'Novidades da Semana: Perfumes Que Acabaram de Chegar!',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    excerpt: 'Confira os lançamentos mais quentes em perfumaria importada, aromas que vão te conquistar...',
    content: `
## Descubra as Fragrâncias que Vão Marcar Sua Presença

Nesta semana, a VS Imports traz uma seleção especial de perfumes importados que são pura sofisticação e exclusividade. Prepare-se para se apaixonar por aromas que combinam tradição e modernidade, perfeitos para todas as ocasiões.

### Para Ela: Flores e Frutas em Harmonia

*   **Encanto Floral:** Uma explosão de jasmim e rosas, com um toque sutil de baunilha. Ideal para mulheres românticas e delicadas.
*   **Paixão Cítrica:** Notas vibrantes de laranja e limão siciliano, equilibradas com um fundo amadeirado. Perfeito para quem busca frescor e energia.

### Para Ele: Amadeirados e Especiarias Sedutoras

*   **Legado Intenso:** Uma combinação robusta de cedro e sândalo, com um toque picante de cardamomo. Para homens de personalidade forte e marcante.
*   **Aventura Refrescante:** Notas aquáticas e mentoladas, com um leve toque de gengibre. A escolha ideal para o homem moderno e aventureiro.

Visite nossa seção de perfumes e encontre o aroma que mais combina com você!
    `,
    author: 'Equipe VS Imports',
    category: 'Perfumes',
    tags: ['lançamentos', 'perfumes femininos', 'perfumes masculinos'],
    imageUrl: 'https://picsum.photos/seed/blogperfume/800/400',
  },
  {
    id: '2',
    slug: 'dicas-para-cuidar-do-seu-relogio-importado',
    title: '5 Dicas Essenciais para Cuidar do Seu Relógio Importado',
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    excerpt: 'Seu relógio é uma joia. Aprenda como mantê-lo impecável por muito mais tempo com nossas dicas...',
    content: `
## Preserve a Beleza e Funcionalidade do Seu Acessório Favorito

Relógios importados são mais do que simples marcadores de tempo; são declarações de estilo e, muitas vezes, investimentos. Para garantir que seu relógio continue funcionando perfeitamente e mantendo sua beleza original, alguns cuidados são essenciais:

1.  **Limpeza Regular:** Utilize um pano macio e seco para limpar a caixa e a pulseira. Para pulseiras de metal, uma escova de cerdas macias pode ajudar a remover sujeira acumulada. Evite produtos químicos agressivos.
2.  **Evite Impactos e Arranhões:** Embora muitos relógios sejam resistentes, grandes impactos podem danificar o mecanismo interno. Guarde-o em um local seguro quando não estiver usando.
3.  **Cuidado com a Água:** Verifique a resistência à água do seu modelo. Mesmo relógios à prova d'água não devem ser expostos a água quente ou vapor, pois isso pode comprometer as vedações.
4.  **Revisões Periódicas:** Assim como um carro, relógios mecânicos precisam de revisões periódicas (geralmente a cada 3-5 anos) para lubrificação e verificação do mecanismo.
5.  **Armazenamento Adequado:** Quando não estiver em uso, guarde seu relógio em sua caixa original ou em um porta-relógios, longe da luz solar direta e de campos magnéticos.

Seguindo essas dicas simples, seu relógio importado será um companheiro fiel por muitos anos!
    `,
    author: 'João Especialista',
    category: 'Acessórios',
    tags: ['cuidados', 'relógios', 'dicas'],
    imageUrl: 'https://picsum.photos/seed/blogwatch/800/400',
  },
];
