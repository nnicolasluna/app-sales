export interface Sale {
  id: number;
  user_name: string | number;
  total: string | number;
  created_at: string | number;
  sale_details?: SaleDetail[];
}
export interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  image?: string;
}
export interface SaleDetail {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price: string;
  subtotal: string;
  product: Product;
}
