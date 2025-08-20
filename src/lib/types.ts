export interface IProductProps {
  id?: number;
  name: string;
  price: string | number;
  imageUrl: string;
  slug?: string;
  description?: string;
  category?: number;
  quantity_sold?: number;
}

export interface User {
  id: number;
  id_role: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  profile_image: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface LoginResponse {
  status: string;
  message: string;
  user: User;
  access_token: string;
  token_type: string;
  email_not_verified?: boolean;
}
