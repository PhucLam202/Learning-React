import { useState, useEffect } from "react";
import "./App.css";
import Search from "./components/Search.jsx";
import { Movie } from "./types/movieType.js";
import Spinner from "./components/Spinner.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const options = {
  mehthod: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};
const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, SetErrorMsg] = useState("");
  const [movieList, SetMovieList] = useState<Movie[]>([]);
  const [isLoading, SetIsloading] = useState(false);

  const fetchMovie = async () => {
    SetIsloading(true);
    SetErrorMsg("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, options);
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
      SetErrorMsg("Error to fetching movie, please try again");
    } finally {
      SetIsloading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <h1>
            find your <span className="text-gradient">movies</span> here
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2>All Movie</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <p key={movie.id} className="text-white">
                  {movie.title}{" "}
                </p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
