import { MetadataRoute } from 'next'
import axios from 'axios'

interface Post {
  id: number;
  slug: string;
  updated_at: string;
  status: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://moobeefsteak.online'
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://moobeefsteak.online'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Fetch all published posts
    const response = await axios.get(`${apiUrl}/api/user/posts?per_page=1000`)
    const posts: Post[] = response.data.data || []

    // Generate post URLs
    const postUrls: MetadataRoute.Sitemap = posts
      .filter(post => post.status === true)
      .map(post => ({
        url: `${siteUrl}/tin-tuc/${post.slug || post.id}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))

    return [...staticPages, ...postUrls]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if API fails
    return staticPages
  }
}
