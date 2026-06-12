export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  mlUrl?: string;
  shopeeUrl?: string;
  whatsappUrl?: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Sale {
  id: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  price: number;
  paymentMethod: "Pix" | "Cartão" | "Boleto" | "PayPal" | "Link de Checkout";
  date: string;
  pixPayerName?: string;
  pixTransactionId?: string;
  shippingCep?: string;
  shippingAddress?: string;
  shippingNumber?: string;
  shippingComplement?: string;
  shippingNeighborhood?: string;
  shippingCity?: string;
  shippingState?: string;
}
