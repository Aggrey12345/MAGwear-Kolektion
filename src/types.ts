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
