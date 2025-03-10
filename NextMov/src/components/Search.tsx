import React from "react";
import { SearchProps } from "../types/search";

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
  return (
    <div className="search">
      <div>
        <img src="search.png"></img>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            
          />
        </div>
      </div>
    </div>
  );
};
export default Search;
