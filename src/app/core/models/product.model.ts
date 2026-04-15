export const GOLD_CATEGORIES = [
  'Rings',
  'Necklaces',
  'Chains',
  'Earrings',
  'Bangles',
  'Bracelets',
  'Pendants',
  'Anklets',
  'Mangalsutra',
  'Coins & Bars',
];

export interface ProductImage {
  _id: string;
  publicId: string;
  url: string;
  originalName: string;
  isThumbnail: boolean;
}
export interface ProductVideo {
  publicId: string;
  url: string;
  originalName: string;
}
export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  productType: string;
  weight: number;
  hallmark: string;
  karat: number;
  stock: number;
  images: ProductImage[];
  video: ProductVideo | null;
  createdAt: string;
}
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}
