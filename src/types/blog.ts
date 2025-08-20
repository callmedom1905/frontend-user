export interface BlogPostProps {
  id?: number;
  slug?: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ApiBlogPost {
  id?: number;
  slug?: string;
  title: string;
  description: string;
  image?: string;
  og_image?: string;
  image_url?: string;
  imageUrl?: string;
}
