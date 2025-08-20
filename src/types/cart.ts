export interface CartItem {
  id?: string | number;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
  imageSrc?: string;
}

export interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
  slug?: string;
  onOrder?: () => void;
}
