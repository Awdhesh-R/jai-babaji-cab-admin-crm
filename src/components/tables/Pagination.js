'use client';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage === 3) {
        pages.push(2, 3, 4, '...', totalPages);
      } else if (currentPage === 4) {
        pages.push(3, 4, 5, '...', totalPages);
      } else if (currentPage < totalPages - 2) {
        pages.push(currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      } else {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex justify-end mt-4 mb-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border border-gray-400 text-sm hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>

      {pages.map((page, i) => (
        <button
          key={i}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-4 py-2 border-r border-t border-b border-gray-400 text-sm ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          } ${page === '...' ? 'cursor-default text-gray-400' : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border-t border-b border-r border-gray-400 text-sm hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

