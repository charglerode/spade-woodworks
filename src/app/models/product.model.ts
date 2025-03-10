export interface Product {
  _id: string;
  name: string;
  price: number;
  available: boolean;
  category: string;
  description?: string;
  images: string[];
  featured: boolean;
  options: ProductGroup[];
}

export interface ProductGroup {
  name: string;
  items: ProductItem[];
}

export interface ProductItem {
  name: string;
  price: number;
  fixed: boolean;
  multiplier: number;
  default: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: string[];
}
