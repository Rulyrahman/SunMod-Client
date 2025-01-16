import { useCallback, useEffect, useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import { fetchDataPagination } from "../admin/api/apiService";

const Artikel = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchDataPagination("article", currentPage, itemsPerPage);
      setArticles(response.data.reverse());
      setCurrentPage( response.currentPage )
      setTotalPages( response.totalPages )
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage] );
  
  useEffect(() => {

    loadArticles();
  }, [loadArticles]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto">
      <div className="max-w-full">
        <div className="py-10 h-[200px] md:h-[280px] lg:h-[400px] flex lg:justify-center lg:items-center bg-gradient-to-l from-blue-50 via-blue-400 to-custom-blue mt-3 sm:mt-5 lg:mt-15 rounded-custom-br lg:mx-1">
          <div className="max-w-full mx-auto px-4 sm:px-8 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="title-content space-y-4 my-auto text-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-widest">ARTIKEL SUMOD</h1>
              <h2 className="font-normal text-xs sm:text-xl lg:text-2xl leading-3 tracking-widest">
                Solusi Sehat untuk hidup yang Lebih Baik
              </h2>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="overflow-hidden md:block hidden">
                <img
                  src="https://res.cloudinary.com/dwaopoeya/image/upload/v1736190549/assets/h8ecnlccaezfcxfm1q6b.png"
                  alt="Profile"
                  className="w-1/2 h-auto object-cover mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white shadow-custom rounded-custom-br overflow-hidden">
                <img
                  src={article.picture}
                  alt={article.name}
                  className="w-full h-56 sm:h-64 lg:h-72 object-cover object-center"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 leading-tight">{article.name}</h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{article.description}</p>
                  <p className="text-xs text-gray-500 mt-3">{new Date(article.createdAt).toLocaleDateString()}</p>
                  <div className="mt-4">
                    <a
                      href={`artikel/detail/${article.id}`}
                      className="text-blue-600 font-medium hover:underline transition-all duration-200"
                    >
                      Baca Selengkapnya →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-center space-x-2">
            {currentPage > 3 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                &lt;
              </button>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = Math.max(1, currentPage - 2) + index;
              if (pageNumber <= totalPages) {
                return (
                  <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNumber ? "bg-sumod-bl3 text-white" : "bg-gray-200"
                    }`}
                    >
                    {pageNumber}
                  </button>
                );
              }
              return null;
            })}

            {currentPage < totalPages - 2 && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artikel;
