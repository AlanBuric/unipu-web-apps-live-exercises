export type Product = {
  name: string;
  price: number;
  sizes: string[];
  imageUrls: string[];
  description: string;
  characteristics: string[];
  colors: Color[];
  details: string;
}

export type Color = {
  name: string,
  hex: string
};

export type OrderItem = {
  productId: string | number;
  amount: number;
  color: string;
  size: string;
}

export type Order = {
  items: OrderItem[];
  cost: number;
}