import React, { useEffect, useState } from "react";
import MovieTrendingCard from "./MovieTrendingCard";
import Spinner from "./Spinner";
import { Movie } from "../types/movieType";

const TrendingMoviePage: React.FC = () => {
  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const [errorMsg, SetErrorMsg] = useState("");
  const [isLoading, SetIsloading] = useState(false);
  const [trendingTimeframe, setTrendingTimeframe] = useState("day");
  const [movieTrendingList, SetMovieTrendingList] = useState<Movie[]>([]);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 6;

  // Thêm state cho trang đang được chọn
  const [activePage, setActivePage] = useState(1);

  const fetchTrending = async () => {
    SetIsloading(true);
    SetErrorMsg("");
    try {
      const endpoint = `${API_BASE_URL}/trending/movie/${trendingTimeframe}?language=en-US`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed To Fetch Data");
      }
      const data = await response.json();
      if (!data.results) {
        SetErrorMsg("No movies found or an error occurred.");
        SetMovieTrendingList([]);
        return;
      }
      SetMovieTrendingList(data.results || []);
    } catch (error) {
      console.log(error);
      SetErrorMsg("Error fetching trending movies, please try again.");
    } finally {
      SetIsloading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [trendingTimeframe]);

  // Tính toán phim hiển thị theo trang
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movieTrendingList.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  // Hàm chuyển trang
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setActivePage(pageNumber); 
  };

  return (
    <div>
      <section className="all-trending-movies">
        <select
          value={trendingTimeframe}
          onChange={(e) => setTrendingTimeframe(e.target.value)}
        >
          <option value="day">Today</option>
          <option value="week">Week</option>
        </select>

        {isLoading ? (
          <Spinner />
        ) : errorMsg ? (
          <p className="text-red-500">{errorMsg}</p>
        ) : (
          <ul>
            {currentMovies.map((movie) => (
              <MovieTrendingCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}

        {/* Nút phân trang */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(movieTrendingList.length / moviesPerPage) }, (_, index) => (
            <button 
              key={index + 1} 
              onClick={() => paginate(index + 1)} 
              className={`pagination-btn ${activePage === index + 1 ? 'active' : ''}`} // Thêm lớp active
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrendingMoviePage;
