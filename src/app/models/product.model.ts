export interface Product {
  id: number;
  name: string;
  price: number;
  available: boolean;
  category: string;
  description?: string;
  images: string[];
}