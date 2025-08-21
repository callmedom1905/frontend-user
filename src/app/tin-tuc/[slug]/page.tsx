import Image from "next/image";
import axios from "axios";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/StructuredData";
import VoucherWrapper from "../../../components/content/VoucherClaim/VoucherWrapper";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  views: number;
  created_at: string;
  updated_at: string;
  outstanding: boolean;
  status: boolean;
  id_voucher?: number | null;
  voucher?: {
    id: number;
    name: string;
    code: string;
    discount_type: number;
    discount_value: number;
    status: boolean;
    start_date: string;
    end_date: string;
  };
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  word_count?: number;
  reading_time?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    profile_image?: string;
  };
}

interface PageProps {
  params: {
    slug: string;
  };
}

// Fetch post function for reuse
async function fetchPost(slug: string): Promise<Post> {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://moobeefsteak.online"}/api/user/posts/${slug}`
    );
    
    const post: Post = res.data.data;
    
    if (!post || !post.status) {
      throw new Error('Post not found or inactive');
    }
    
    return post;
  } catch (error) {
    throw new Error('Failed to fetch post');
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await fetchPost(resolvedParams.slug);
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";
    const postUrl = `${siteUrl}/tin-tuc/${post.slug || post.id}`;
    
    return {
      title: post.meta_title || `${post.title} | Moo Beef Steak Prime`,
      description: post.meta_description || post.description,
      keywords: post.meta_keywords?.split(',').map(k => k.trim()),
      
      openGraph: {
        title: post.og_title || post.title,
        description: post.og_description || post.description,
        images: [{ 
          url: post.og_image || post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }],
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [post.user?.name || 'Admin'],
        url: postUrl,
        siteName: 'Moo Beef Steak Prime',
      },
      
      twitter: {
        card: 'summary_large_image',
        title: post.twitter_title || post.title,
        description: post.twitter_description || post.description,
        images: [post.twitter_image || post.image],
        creator: '@moobeefsteak',
      },
      
      alternates: {
        canonical: post.canonical_url || postUrl
      },
      
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      other: {
        'article:published_time': post.created_at,
        'article:modified_time': post.updated_at,
        'article:author': post.user?.name || 'Admin',
        'article:section': 'Food & Restaurant',
        'article:tag': post.meta_keywords || '',
      }
    };
  } catch (error) {
    return {
      title: 'Bài viết không tồn tại | Moo Beef Steak Prime',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
    };
  }
}

export default async function PostDetail({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    // Use the same fetchPost function for consistency
    const post = await fetchPost(resolvedParams.slug);

    // Fetch related posts for sidebar
    const relatedRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://moobeefsteak.online"}/api/user/posts?sort=-created_at&per_page=4`
    );
    const allPosts = relatedRes.data.data || [];
    const relatedPosts = allPosts
      .filter((p: Post) => p.id !== post.id && p.status === true)
      .slice(0, 3);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Check if post has active voucher
    const hasActiveVoucher = post.id_voucher && post.voucher && post.voucher.status;
    
    console.log('Post Debug:', {
      postId: post.id,
      id_voucher: post.id_voucher,
      voucher: post.voucher,
      hasActiveVoucher
    });

    return (
      <div className="flex justify-center bg-stone-100 min-h-screen py-8 px-2">
        {/* SEO Structured Data */}
        <ArticleStructuredData post={post} />
        <BreadcrumbStructuredData post={post} />
        
        {/* Voucher Claim Button - kiểm tra trước khi hiển thị */}
        <VoucherWrapper 
          voucher={post.voucher} 
          postTitle={post.title}
        />
        
        {/* Main content */}
        <div className="flex w-[1400px] gap-8">
          {/* Left: Post content */}
          <div className="rounded-xl flex-none" style={{ width: 940 }}>
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-6">
              <a href="/tin-tuc" className="hover:text-blue-600">Tin tức</a>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{post.title}</span>
            </nav>

            {/* Post header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">{post.title}</h1>
              
              {/* Voucher Badge - hiện trong content nếu có voucher */}
              {/* {hasActiveVoucher && (
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600">🎁</span>
                    <span className="text-sm font-medium text-amber-800">
                      Bài viết này có voucher miễn phí! Đọc đến cuối để nhận voucher 
                      <strong className="text-amber-900">
                        {post.voucher!.discount_type === 1 
                          ? `${post.voucher!.discount_value}%`  // Type 1: Phần trăm
                          : `${post.voucher!.discount_value.toLocaleString()}đ`  // Type 2: Số tiền VND
                        }
                      </strong>
                    </span>
                  </div>
                </div>
              )} */}

              {/* <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>📅 {formatDate(post.created_at)}</span>
                {post.reading_time && (
                  <>
                    <span>•</span>
                    <span>⏱️ {post.reading_time} phút đọc</span>
                  </>
                )}
                {post.word_count && (
                  <>
                    <span>•</span>
                    <span>📝 {post.word_count} từ</span>
                  </>
                )}
                {post.user && (
                  <>
                    <span>•</span>
                    <span>👤 {post.user.name}</span>
                  </>
                )}
              </div> */}
              <p className="text-lg text-gray-700 leading-relaxed">{post.description}</p>
            </div>

            {/* Featured image */}
            {post.image && (
              <div className="mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="rounded-lg object-cover w-full h-80"
                />
              </div>
            )}

            {/* Post content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-base leading-7 text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Voucher CTA at end of content */}
            {/* {hasActiveVoucher && (
              <div className="mt-8 p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white text-center">
                <div className="text-2xl mb-2">🎉</div>
                <h3 className="text-xl font-bold mb-2">Cảm ơn bạn đã đọc hết bài viết!</h3>
                <p className="mb-4 opacity-90">
                  Nhận ngay voucher giảm giá {post.voucher!.discount_type === 1 
                    ? `${post.voucher!.discount_value}%`  // Type 1: Phần trăm
                    : `${post.voucher!.discount_value.toLocaleString()}đ`  // Type 2: Số tiền VND
                  } từ chúng tôi
                </p>
                <div className="text-sm opacity-75">
                  Voucher sẽ xuất hiện ở góc màn hình →
                </div>
              </div>
            )} */}
          </div>

          {/* Right: Related posts sidebar */}
          <div className="w-[460px] flex-none">
            <div className="rounded-xl p-6">
              <h2 className="font-bold text-xl mb-6 text-gray-900">Tin mới lên</h2>
              <div className="flex flex-col gap-4">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((item: Post, idx: number) => (
                    <a 
                      key={item.id} 
                      href={`/tin-tuc/${item.id}`}
                      className="flex bg-white rounded-[7px] overflow-hidden shadow-sm transition-shadow"
                    >
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <div className="font-medium text-base line-clamp-3 text-gray-900 hover:text-blue-600 transition-colors">
                          {item.title}
                          {/* Badge for posts with vouchers */}
                          {item.id_voucher && item.voucher?.status && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              🎁 Có voucher
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {item.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                      {item.image && (
                        <div className="w-32 flex-shrink-0 h-full p-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-[7px]"
                          />
                        </div>
                      )}
                    </a>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có bài viết liên quan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
} 