const API_KEY = '8368d102';// API key for OMDB

// Define the structure of a Movie object
interface Movie {
  id: string
  title: string
  year: string
  image: string
};

// Parameters for the searchMovies function
interface SearchMoviesParams {
  search: string
};

// Structure of the OMDB API response for a single movie
interface OMDBMovieResponse {
  imdbID: string
  Title: string
  Year: string
  Poster: string
};

// Structure of the overall OMDB API response
interface OMDBResponse {
  Search: OMDBMovieResponse[]
};

// Function to search movies from the OMDB API
export const searchMovies = async ({ search }: SearchMoviesParams): Promise<Movie[] | null> => {
  // Return null if the search query is empty
  if (search === '') return null;

  try {
    // Fetch data from the OMDB API using the search query
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`);
    const json: OMDBResponse = await response.json();

    // Extract the 'Search' array from the response
    const movies = json.Search;

    // Map the OMDB API response to the Movie interface format
    return movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      image: movie.Poster,
    }));
  } catch (e) {
    // Throw an error if the request fails
    throw new Error('Error searching movies');
  };
}
