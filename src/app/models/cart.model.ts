import { ShippingRate } from './product.model';

export interface Cart {
  shipping: ShippingRate;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shipping: ShippingRate[];
  options: string[];
}
