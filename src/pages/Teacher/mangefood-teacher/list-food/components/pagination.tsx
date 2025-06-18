import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  return (
    <div className="flex justify-center items-center gap-2 p-5 mt-5">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        className="px-3 py-1 rounded border hover:bg-gray-200"
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded border ${
              currentPage === page ? "bg-blue-800 text-white" : ""
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        className="px-3 py-1 rounded border hover:bg-gray-200"
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;