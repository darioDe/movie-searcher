import { useRef, useState, useMemo, useCallback } from 'react';
import { searchMovies } from '../services/movies.js';

// Define the structure of a Movie object
interface Movie {
  id: string
  title: string
  year: string
  image: string
};

// Props for the useMovies hook, which accepts search query and sort flag
interface UseMoviesProps {
  search: string
  sort: boolean
};

// Params for the getMovies function
interface GetMoviesParams {
  search: string
};

// Custom hook for managing movie search and sorting
export function useMovies ({ search, sort }: UseMoviesProps) {
  // State to store the list of movies and loading status
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  // useRef to store the previous search value, to prevent redundant fetches
  const previousSearch = useRef<string>(search);

  // Function to fetch movies based on search query, memoized to avoid redefinition
  const getMovies = useCallback(async ({ search }: GetMoviesParams) => {
    // Return early if search query is the same as the previous one
    if (search === previousSearch.current) return

    try {
      setLoading(true); // Set loading state to true during data fetch
      setError(null); // Reset any previous error
      previousSearch.current = search; // Update previous search with current query
      const newMovies = await searchMovies({ search }); // Fetch movies
      if (newMovies) {
        setMovies(newMovies); // Set movies if response is valid
      } else {
        setMovies([]); // Set empty list if no movies found
      }
    } catch (e) {
      setError((e as Error).message); // Set error if there's a problem
    } finally {
      setLoading(false); // Stop loading after fetch is complete
    }
  }, []);

  // Memoized sorting logic, only recomputed when 'movies' or 'sort' change
  const sortedMovies = useMemo(() => {
        if (!movies) return;
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies // Return original order if 'sort' is false
  }, [sort, movies]);

  // Return sorted movies, fetch function, and loading state
  return { movies: sortedMovies, getMovies, loading };
};