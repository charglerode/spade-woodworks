import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wood Polish',
      price: 29.99,
      available: true,
      category: 'Wood Care',
      description: 'A high-quality polish that protects and shines wood surfaces.',
      images: [
        'https://placehold.co/300x200/grey/white',
        'https://placehold.co/300x200/grey/black',
        'https://placehold.co/300x200/grey/red',
        'https://placehold.co/300x200/grey/orange',
        'https://placehold.co/300x200/grey/blue'
        ],
    },
    {
      id: 2,
      name: 'Carving Oil',
      price: 19.99,
      available: false,
      category: 'Wood Care',
      description: 'Ideal oil for smooth carving and maintenance of wood art pieces.',
      images: [
        'https://placehold.co/300x200/grey/white',
        'https://placehold.co/300x200/grey/black',
        'https://placehold.co/300x200/grey/red',
        'https://placehold.co/300x200/grey/orange',
        'https://placehold.co/300x200/grey/blue'
        ],
    },
    {
      id: 3,
      name: 'Handcrafted Vase',
      price: 39.99,
      available: true,
      category: 'Crafts',
      description: 'A beautifully handcrafted vase perfect for your home décor.',
      images: [
        'https://placehold.co/300x200/grey/white',
        'https://placehold.co/300x200/grey/black',
        'https://placehold.co/300x200/grey/red',
        'https://placehold.co/300x200/grey/orange',
        'https://placehold.co/300x200/grey/blue'
        ],
    },
    {
      id: 4,
      name: 'Craft Glue',
      price: 9.99,
      available: true,
      category: 'Crafts',
      description: 'Strong adhesive specifically designed for craft projects.',
      images: [
        'https://placehold.co/300x200/grey/white',
        'https://placehold.co/300x200/grey/black',
        'https://placehold.co/300x200/grey/red',
        'https://placehold.co/300x200/grey/orange',
        'https://placehold.co/300x200/grey/blue'
        ],
    },
    {
      id: 5,
      name: 'Wooden Chair',
      price: 99.99,
      available: true,
      category: 'Furniture',
      description: 'Ergonomically designed wooden chair for ultimate comfort.',
      images: [
        'https://placehold.co/300x200/grey/white',
        'https://placehold.co/300x200/grey/black',
        'https://placehold.co/300x200/grey/red',
        'https://placehold.co/300x200/grey/orange',
        'https://placehold.co/300x200/grey/blue'
        ],
    },
    {
      id: 6,
      name: 'Rustic Table',
      price: 149.99,
      available: false,
      category: 'Furniture',
      description: 'A rustic dining table with a classic design that stands out.',
      images: [
        'https://placehold.co/300x200/grey/white',
        'https://placehold.co/300x200/grey/black',
        'https://placehold.co/300x200/grey/red',
        'https://placehold.co/300x200/grey/orange',
        'https://placehold.co/300x200/grey/blue'
        ],
    },
  ];

  getProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
