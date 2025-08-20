import React from 'react';

interface Post {
  id: number;
  title: string;
  slug?: string;
  description: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  word_count?: number;
  reading_time?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    profile_image?: string;
  };
}

interface StructuredDataProps {
  post: Post;
}

export function ArticleStructuredData({ post }: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  const postUrl = `${siteUrl}/tin-tuc/${post.slug || post.id}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": {
      "@type": "ImageObject",
      "url": post.image,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": post.user?.name || "Admin",
      "url": post.user?.profile_image || undefined
    },
    "publisher": {
      "@type": "Organization",
      "name": "Moo Beef Steak Prime",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/images/logo.png`,
        "width": 200,
        "height": 60
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "url": postUrl,
    "wordCount": post.word_count || undefined,
    "timeRequired": post.reading_time ? `PT${post.reading_time}M` : undefined,
    "articleSection": "Food & Restaurant",
    "articleBody": post.content.replace(/<[^>]*>/g, '').substring(0, 500) + "...",
    "inLanguage": "vi-VN",
    "potentialAction": {
      "@type": "ReadAction",
      "target": postUrl
    }
  };

  // Remove undefined values
  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData, (key, value) => 
    value === undefined ? undefined : value
  ));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData, null, 2) }}
    />
  );
}

export function BreadcrumbStructuredData({ post }: StructuredDataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tin tức",
        "item": `${siteUrl}/tin-tuc`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${siteUrl}/tin-tuc/${post.slug || post.id}`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData, null, 2) }}
    />
  );
}

export function OrganizationStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Moo Beef Steak Prime",
    "description": "Where Prime Cuts Meet Perfection - Nhà hàng beefsteak cao cấp",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "image": `${siteUrl}/images/restaurant-hero.jpg`,
    "servesCuisine": ["American", "Steakhouse"],
    "priceRange": "$$-$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "Ho Chi Minh City",
      "addressCountry": "VN"
    },
    "telephone": "+84-123-456-789",
    "openingHours": [
      "Mo-Su 10:00-22:00"
    ],
    "sameAs": [
      "https://facebook.com/moobeefsteak",
      "https://instagram.com/moobeefsteak"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData, null, 2) }}
    />
  );
}
