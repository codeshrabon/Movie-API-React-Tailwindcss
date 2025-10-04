import { useEffect, useState } from "react";

import { useDebounce } from "react-use";
//import { useDebounceValue } from "react-use";
import "./App.css";
import MovieCard from "./components/MovieCard.jsx";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";

// use to get the movies
const API_BASE_URL = "https://api.themoviedb.org/3";

// import the api key
const API_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

// use API_OPTION
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    //use authentication
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

const App = () => {
  // to search our movie we use state here not on the search.jsx
  // we will use them from there to search.jsx then use them to work with
  const [searchTerm, setSearchTerm] = useState("");

  // see error message in the page
  const [errorMessage, setErrorMessage] = useState("");

  // now we need movie list in our page
  const [movieList, setMovieList] = useState([]);

  // also we need loading phase while movie is being load we need to show something as loading
  const [isLoading, setIsLoading] = useState(false);

  // for debounce we use  useState
  const [debounceSearchTerm, setDebounceSearchTerm] = useState(searchTerm);

  // using this instead of debounce
  //const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);

  // here use useDebounce hook and implement searchMovie component
  // here insted using it inside of UseEffect hook use component searchTerm
  // and dependency array searchTerm
  // Debounce the searchTerm to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  //useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])
 //const [debounceSearchTerm] = useDebounceValue(searchTerm,500);

  // now time to fetch movies form the api
  const fetchMovies = async (query = "") => {
    // here we are setting loading cause before movie or the data are being shown it will load
    setIsLoading(true);
    // before fatching the data there is nothing to show as error message
    setErrorMessage("");

    try {
      /* we use encodedURIComponent to query to search specific movie data */
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      // when the end point done we will take response from endpoint to API_OPTIONS
      // here fetch is javascript function to get post delete create all the http request
      const response = await fetch(endpoint, API_OPTIONS);

      // can use alert to get response
      //alert(response);

      // if something went wrong we put an error here
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      // if it is not failed we get data
      const data = await response.json();

      // use consol log to see what data we get
      console.log(data);

      // in case if there is any problem
      /*  if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");

        // so if the movie are not fetch we need to show something like empty
        setMovieList([]);
        return;
      } */
      // and now if movie is fached then we will show them
      setMovieList(data.results || []);
      console.log("Result: ", data.results);
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);

      // to display message in the page
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      // in last we use finally method cause if all above are being used then we need to stop the loading
      setIsLoading(false);
    }
  };

  // Instead of relying on react-use, you can implement 
  // debounce with useEffect + setTimeout. 
  // This is very clear and avoids version issues:
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // we are not using it and instead we use debounce inside fetchMovie method
  // and use searchTerm inside debounce hook above

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  /*   useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]); */

  return (
    <>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src="hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> and{" "}
              <span className="text-gradient">Enjoy</span> Without
              <span className="text-gradient"> Hassle</span>
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <h2 className="text-white p-3 m-2">{searchTerm}</h2>
          </header>

          <section className="all-movies">
            <h2 className="mt-[20px]">All movies</h2>

            {/* to display the error message into sections */}
            {/* instead of showing thins message we can use some ternary operation and
            show the movie list  */}
            {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {/* often we use this map to fetch the data  */}
                {movieList.map((movie) => (
                  /* the main part here to use key. cause if we use the key then we can 
                  keep track of the list  */
                  /* we are using movieCard component here  */
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default App;
