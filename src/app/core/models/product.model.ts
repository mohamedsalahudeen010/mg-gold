export interface Media {
  _id: string;
  publicId: string;
  url: string;
  resourceType: 'image' | 'video';
  originalName: string;
  isThumbnail: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  media: Media[];
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}
