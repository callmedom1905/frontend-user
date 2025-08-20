"use client";

import React from 'react';

export const Pagination: React.FC = () => {
  const pageNumbers = ['1', '2', '...', '5', '6', '>'];

  return (
    <nav className="flex gap-3 self-center mt-8 ml-10 max-w-full text-lg text-center text-yellow-50 whitespace-nowrap w-[235px]" aria-label="Pagination">
      {pageNumbers.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="my-auto text-black">{page}</span>
          ) : (
            <button className="p-2.5 rounded-md bg-stone-800" aria-label={`Page ${page}`}>
              {page}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};
