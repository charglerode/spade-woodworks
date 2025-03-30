export interface Cart {
  items: CartItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options: string[];
}
