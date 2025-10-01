import { useEffect, useState } from "react";

import "./App.css";
import Search from "./components/Search.jsx";


// use to get the movies
  const API_BASE_URL = 'https://api.themoviedb.org/3';

  // import the api key
  const API_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

  // use API_OPTION
const API_OPTIONS= {
  method:'GET',
  headers:{
    accept:'application/json',
    //use authentication 
    Authorization:`Bearer ${API_TOKEN}`
  }
};

const App = () => {
  // to search our movie we use state here not on the search.jsx
  // we will use them from there to search.jsx then use them to work with
  const [searchTerm, setSearchTerm] = useState('');

  // see error message in the page 
  const [errorMessage, setErrorMessage] = useState('');

  // now time to fetch movies form the api 
  const fetchMovies = async () => {
    try{
        const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

        // when the end point done we will take response from endpoint to API_OPTIONS 
        // here fetch is javascript function to get post delete create all the http request 
        const response = await fetch(endpoint, API_OPTIONS );

        // can use alert to get response 
        //alert(response);

        // if something went wrong we put an error here 
        // if(!response.ok){
        //   throw new Error("Failed to fetch movies");
        // }

          // if it is not failed we get data 
        const data = await response.json();

        // use consol log to see what data we get 
        console.log(data);

    }
    catch(error){
      console.log(`Error fetching movies: ${error}`);

      // to display message in the page 
      setErrorMessage('Error fetching movies. Please try again later.');
    }
  }

  useEffect( () => {
    fetchMovies();

  },[]);
  

  return (
    <>
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src="hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Without
              the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
             <h2 className="text-white p-3 m-2">{searchTerm}</h2>
          </header>

          <section className="all-movies">
            <h2>All movies</h2>

            {/* to display the error message into sections */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </section>
         
        </div>
      </main>
    </>
  );
};

export default App;
