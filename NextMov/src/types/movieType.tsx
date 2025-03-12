export interface Movie {
    title: string;
    id:number;
    vote_average:number;
    poster_path:string;
    release_date:string;
    original_language:string;
  }
  
export interface MovieCardProps {
    movie: Movie;

  }