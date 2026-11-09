export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
};
export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: Category | string;
  image: string;
  gallery?: string[];
  price: number;
  compareAtPrice?: number;
  unit: string;
  stock: number;
  sku?: string;
  isFeatured: boolean;
  isActive: boolean;
};
export type CartItem = { product: Product; quantity: number };
export type Order = {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; address: string };
  items: {
    name: string;
    image: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  note?: string;
  status: string;
  createdAt: string;
};
