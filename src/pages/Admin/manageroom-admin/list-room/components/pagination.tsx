import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const RoomPagination: React.FC<Props> = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        className="px-3 py-1 rounded border hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-800 text-white' : ''}`}
            >
              {page}
            </button>
          );
        } else if (
          (page === currentPage - 2 && page > 1) ||
          (page === currentPage + 2 && page < totalPages)
        ) {
          return <span key={page} className="px-2">...</span>;
        } else {
          return null;
        }
      })}

      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        className="px-3 py-1 rounded border hover:bg-gray-200 disabled:opacity-50"
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default RoomPagination;
