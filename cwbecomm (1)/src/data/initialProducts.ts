import { Product, Review } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Smartwatch Sport Pro GPS",
    description: "Monitoramento cardíaco avançado, GPS integrado, resistente à água 50m e bateria com duração de até 14 dias. Ideal para atividades físicas e conexões inteligentes no dia a dia.",
    price: 389.90,
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600",
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    whatsappUrl: "https://wa.me/5511958975285?text=Olá!%20Tenho%20interesse%20no%20Smartwatch%20Sport%20Pro%20GPS.%20Ainda%20está%20disponível?",
    featured: true
  },
  {
    id: "prod-2",
    name: "Headphone Bluetooth ANC Premium",
    description: "Cancelamento de ruído ativo de última geração, som de alta fidelidade Hi-Res, almofadas confortáveis em couro ecológico e até 40 horas de reprodução contínua.",
    price: 459.00,
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    whatsappUrl: "https://wa.me/5511958975285?text=Olá!%20Tenho%20interesse%20no%20Headphone%20Bluetooth%20ANC%20Premium.",
    featured: true
  },
  {
    id: "prod-3",
    name: "Teclado Mecânico RGB Hot-Swappable",
    description: "Teclado compacto de alta performance, switches táteis silenciosos intercambiáveis, iluminação RGB customizável e conexão via cabo USB-C Premium destacável.",
    price: 279.90,
    category: "Informática",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?auto=format&fit=crop&q=80&w=600",
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    whatsappUrl: "https://wa.me/5511958975285?text=Olá!%20Tenho%20interesse%20no%20Teclado%20Mecânico%20RGB.",
    featured: false
  },
  {
    id: "prod-4",
    name: "Carregador Magnético de Mesa 3 em 1",
    description: "Estação de recarga por indução rápida de 15W. Carrega simultaneamente seu Smartphone, Smartwatch e fone de ouvido sem fio de forma organizada e segura.",
    price: 189.90,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&q=80&w=600",
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    whatsappUrl: "https://wa.me/5511958975285?text=Olá!%20Tenho%20interesse%20no%20Carregador%20Magnético%203%20em%201.",
    featured: true
  },
  {
    id: "prod-5",
    name: "Luminária Inteligente LED Minimalista",
    description: "Controle de intensidade e cores via aplicativo de celular ou assistente virtual. Design minimalista em alumínio, luz ideal para trabalho, leitura e descanso.",
    price: 229.00,
    category: "Casa & Decoração",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600",
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    whatsappUrl: "https://wa.me/5511958975285?text=Olá!%20Tenho%20interesse%20na%20Luminária%20%20Inteligente%20LED.",
    featured: false
  },
  {
    id: "prod-6",
    name: "Mochila Executiva Impermeável Slim",
    description: "Compartimento acolchoado para Notebook de até 15.6 polegadas, costuras reforçadas, revestimento externo impermeável e entrada USB externa para bateria portátil.",
    price: 199.90,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    whatsappUrl: "https://wa.me/5511958975285?text=Olá!%20Tenho%20interesse%20na%20Mochila%20Executiva%20Slim.",
    featured: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Carlos Eduardo Silva",
    rating: 5,
    comment: "Produto entregue super rápido pelo Mercado Livre. Excelente qualidade e o vendedor tirou todas as dúvidas pelo WhatsApp antes da compra.",
    date: "10/05/2026",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev-2",
    name: "Juliana Mendes Garcia",
    rating: 5,
    comment: "Comprei o carregador por indução e a luminária pela Shopee. Chegou bem embalado, perfeito estado, voltarei a comprar com certeza!",
    date: "28/04/2026",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    id: "rev-3",
    name: "Roberto Oliveira Lima",
    rating: 5,
    comment: "Fiz o pedido diretamente pelo WhatsApp da empresa e retirei via motoboy. Atendimento impecável, produtos originais. Recomendo fortemente!",
    date: "14/03/2026",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
  }
];

export const CATEGORIES = [
  "Todos",
  "Eletrônicos",
  "Informática",
  "Acessórios",
  "Casa & Decoração"
];
