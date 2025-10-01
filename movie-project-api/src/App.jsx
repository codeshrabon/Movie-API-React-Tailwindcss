import { useState } from 'react'

import './App.css'
import Search from './components/Search';


const App = () => {
  // to search our movie we use state here not on the search.jsx 
  // we will use them from there to search.jsx then use them to work with 
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>

    <main>

      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Without the Hassle</h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h2 className='text-white'>{searchTerm}</h2>
      </div>
    </main>
    </>
  );
}

export default App
