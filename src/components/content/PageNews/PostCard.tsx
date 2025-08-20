import * as React from "react";
import Link from "next/link";

interface PostCardProps {
  imageUrl: string;
  title: string;
  description: string;
  slug?: string;
  id?: string | number; // Keep for backward compatibility
}

export const PostCard: React.FC<PostCardProps> = ({ imageUrl, title, description, slug, id }) => {
  // Prioritize slug, fallback to id for backward compatibility
  const linkHref = slug ? `/tin-tuc/${slug}` : `/tin-tuc/${id}`;

  return (
    <Link href={linkHref} className="block">
      <article
        className="flex flex-col bg-white rounded-xl max-w-[460px] w-full mx-auto shadow hover:shadow-lg transition-shadow cursor-pointer"
        style={{ minHeight: 420, maxHeight: 1020, overflow: 'hidden' }} // Fixed height for card
      >
        <img
          src={imageUrl}
          className="object-cover w-full rounded-t-xl aspect-[1.53]"
          alt={title}
        />
        <div className="flex flex-col py-3 w-full flex-1">
          <h3
            className="px-4 py-3 w-full text-2xl font-medium"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              minHeight: 56,
              maxHeight: 56,
            }}
          >
            {title}
          </h3>
          <p
            className="px-4 py-3 w-full font-light"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              minHeight: 86,
              maxHeight: 86,
            }}
          >
            {description}
          </p>
          <span className="gap-2.5 self-center px-2.5 py-3.5 w-60 max-w-full leading-none text-center min-h-[50px] text-blue-600 font-semibold">
            Xem thêm
          </span>
        </div>
      </article>
    </Link>
  );
}; 