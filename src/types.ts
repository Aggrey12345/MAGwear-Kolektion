export interface Product {
  id: string;
  name: string;
  category: 'sneakers' | 'perfumes' | 'clothing';
  price: number;
  description: string;
  image: string;
  tag?: string;
  rating: number;
  reviewsCount: number;
  colorway?: string;
  specs?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  userId?: string;
  createdAt: any;
}

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: string;
  createdAt: any;
  promoCode?: string;
  discount?: number;
  shipping?: number;
}

