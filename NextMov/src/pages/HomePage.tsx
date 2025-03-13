import React, { useState, useEffect } from "react";
import { Movie } from "../types/movieType";
import { useDebounce } from "react-use";
import MovieTrendingCard from "../components/MovieTrendingCard";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import Search from "../components/Search";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, SetErrorMsg] = useState("");
  const [movieList, SetMovieList] = useState<Movie[]>([]);
  const [isLoading, SetIsloading] = useState(false);
  const [debouncedSearchTerm, SetDebouncedSearchTerm] = useState("");
  const [trendingTimeframe, setTrendingTimeframe] = useState("day");
  const [movieTrendingList, SetMovieTrendingList] = useState<Movie[]>([]);
  
  useDebounce(() => SetDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovie = async (query = "") => {
    SetIsloading(true);
    SetErrorMsg("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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
        SetMovieList([]);
        return;
      }
      SetMovieList(data.results || []);
    } catch (error) {
      console.log(error);
      SetErrorMsg("Error fetching movie, please try again");
    } finally {
      SetIsloading(false);
    }
  };

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

  useEffect(() => {
    fetchMovie(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="wrapper">
      <header>
        <h1>
          find your <span className="text-gradient">movies</span> here
        </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>
      {/* Discover section */}
      <section className="all-movies">
        <h2 className="mt-5">Discover</h2>
        {isLoading ? (
          <Spinner />
        ) : errorMsg ? (
          <p className="text-red-500">{errorMsg}</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* Trending section */}
      <section className="all-trending-movies">
        <h2 className="mt-5 ">Trending</h2>
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
            {movieTrendingList.map((movie) => (
              <MovieTrendingCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default HomePage;