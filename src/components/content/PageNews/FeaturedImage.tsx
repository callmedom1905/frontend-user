import * as React from "react";

export const FeaturedImage: React.FC = () => {
  return (
    <section className="flex flex-col justify-center py-10 w-full max-w-[1420px] px-4 mx-auto">
      <img
        src="images/banner/banner1.jpg"
        className="object-contain w-full rounded-xl aspect-[2.84]"
        alt="Featured news image"
      />
    </section>
  );
}; 