import { useState, useEffect, useRef } from 'react';

// Custom hook to manage search input and handle validation
export function useSearch () {
  // State for storing the search query and any validation errors
    const [search, updateSearch] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    // useRef to track if it's the user's first input interaction
    const isFirstInput = useRef<boolean>(true);
  
    // useEffect to handle validation logic whenever the search input changes
    useEffect(() => {
      // If it's the first input and the search is still empty, do nothing
      if (isFirstInput.current) {
        isFirstInput.current = search === ''; // Mark it as no longer the first input
        return;
        return;
      };
  
      // Validation logic: Check for different error cases
      if (search === '') {
        setError('The field is empty'); // Error for empty input
        return;
      };
  
      if (search.match(/^\d+$/)) {
        setError("You can't search for a movie with a number"); // Error if the input is only numbers
        return;
      };
  
      if (search.length < 3) {
        setError('The search must be at least 3 characters long'); // Error if the search is too short
        return;
      };
  
       // If none of the errors apply, reset the error state
      setError(null);
    }, [search]);
  
    // Return the search query, update function, and error message
    return { search, updateSearch, error };
  };

  