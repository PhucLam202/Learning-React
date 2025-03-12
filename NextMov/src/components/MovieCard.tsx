import React from "react";
import { MovieCardProps } from "../types/movieType";

const MovieCard: React.FC<MovieCardProps> = ({
  movie: { title, vote_average, original_language, release_date, poster_path },
}) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />{" "}
      <div className="mt-3">
        <p className="text-white">{title} </p>
        <div className="content">
          <div className="rating">
            <img src="stars.png" alt="stars" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            <span>⦾</span>
            <p className="lang">{original_language}</p>
            <span>⦾</span>
            <p className="year">{release_date ? release_date.split('-')[0]: 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
