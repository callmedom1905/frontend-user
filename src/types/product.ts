export interface ProductCarouselProps {
  title: string;
  products?: IProductProps[];
  type?: 'latest' | 'most-sold';
}

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  slug: string;
  description?: string;
  meta_description?: string;
  id_category: number;
  status: boolean;
  quantity_sold?: number;
}

export interface IProductProps {
  id: number;
  name: string;
  price: number | string;
  imageUrl: string;
  slug: string;
  description?: string;
  category?: number;
  status?: boolean;
  quantity_sold?: number;
}
