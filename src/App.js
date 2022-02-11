import React, {useState,useEffect,useCallback} from "react";
import './App.css';
import MovieList from "./components/MovieList";
import AddMovie from './components/AddMovie';
import ForwardCounter from "./counterApp/ForwardCounter";
import BackwardCounter from "./counterApp/BackwardCounter";


function App() {
   const [stateMovies, setStateMovies] = useState([]);
   const [isLoading,setIsLoading] = useState(false);
   const [error,setError] = useState(null)

   
   
  const fetchmoviesHandler = useCallback( async() => {
    setIsLoading(false);
    setError(null);
    try {
      const response = await fetch('https://http-practice-cc14d-default-rtdb.firebaseio.com/movie.json');
      console.log(response)

      if(!response.ok){
        throw new Error('something went wrong');
      }

      const data = await response.json();
       
        const loadedMovies = [];

        for(const key in data){
          loadedMovies.push({
            id:key,
            title:data[key].title,
            openingText:data[key].openingText,
            releaseDate:data[key].releaseDate,

          })
        }


    
    
       
        //  const transformedMovies = data.results.map((movieData) => {
        //    return {
        //      id:movieData.episode_id,
        //      title: movieData.title,
        //      openingText: movieData.opening_crawl,
        //      releaseDate: movieData.release_date
        //    }
        //  })
         setStateMovies(loadedMovies);
     } catch(error){
     setError(error.message)
    }

    setIsLoading(false)
    
  
 },[]);

 useEffect(()=>{
  fetchmoviesHandler()
},[fetchmoviesHandler]);

   async function addMovieHandler(movie){
  const response = await fetch('https://http-practice-cc14d-default-rtdb.firebaseio.com/movie.json',{
     method:'POST',
     body: JSON.stringify(movie),
     headers:{
       'Content-Type':'application/json'
     }
   });
   const data = await response.json()
   console.log(data)
 }


  let content = <p>Found no movies</p>;
  if(stateMovies.length > 0){
    content = <MovieList movies={stateMovies}/>
  } 
  if(error){
    content = <p>{error}</p>
  }

  if(isLoading){
    content = <p>Loading...</p>
  }

  return (
     <React.Fragment>
       <ForwardCounter/>
       <BackwardCounter/>
       <section>
        <AddMovie  onAddMovie={addMovieHandler}/>
      </section>
       <section>
         <button onClick={fetchmoviesHandler}>Fetch Movies</button>
       </section>
       <section>
        {content}
       </section>
     </React.Fragment>
  );
}

export default App;
