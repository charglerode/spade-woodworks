export interface Product {
  _id: string;
  name: string;
  price: number;
  available: boolean;
  category: string;
  description?: string;
  images: string[];
}
