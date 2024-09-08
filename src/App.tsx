import { useState, useCallback } from 'react';
import { useMovies } from './hooks/useMovies';
import { Movies } from './components/Movies';
import { useSearch } from './hooks/useSearch';
import { motion, AnimatePresence } from 'framer-motion';
import iconMovie from './assets/icon-movie.svg'
import debounce from 'just-debounce-it';


function App (): JSX.Element {
  // State for managing sorting
  const [sort, setSort] = useState<boolean>(false);
  
  // Custom hooks for search functionality and movie fetching
  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  // Debounce search function to prevent excessive API calls
  const debouncedGetMovies = useCallback(
    debounce((search: string) => {
      console.log('search', search);
      getMovies({ search });
    }, 300)
    , [getMovies]
  );

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getMovies({ search });
  }
  
  // Toggle sorting state
  const handleSort = () => {
    setSort(!sort);
  }

  // Handle search input changes and debounce movie fetching
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value;
    updateSearch(newSearch);
    debouncedGetMovies(newSearch);
  }

  return (
    <div className='font-sans min-h-screen bg-gradient-to-br from-gray-600 via-gray-800 to-black py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
      {/* Header with title and search form */}
      <motion.header 
          className='text-center mb-8'
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
      >
        <div className='flex items-center justify-center mb-4 gap-3'>
          <img src={iconMovie} className='w-10 h-10 mr-2' alt="" />
          <h1 className='font-heading text-4xl font-bold text-gray-100 mb-4 mt-5'>Movie's Searcher</h1>
        </div>
          <p className='text-xl text-gray-200 mb-6'>Find your favorite movie in this data base</p>
          {/* Search form */}
          <form className='flex flex-col items-center gap-4' onSubmit={handleSubmit}>
            {/* Search input with error handling */}
            <motion.div 
              className='w-full'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className='relative w-full' >
                <input
                  className={`w-full px-4 py-2 rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  onChange={handleChange} 
                  value={search} name='query'
                  placeholder='Star Wars, The Matrix...'
                />
                <AnimatePresence>
                  {error && 
                    (
                      <motion.p 
                        className='absolute text-sm text-red-500 mt-1'
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {error}
                      </motion.p>
                    )
                  }
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Sort checkbox and submit button */}
            <motion.div 
              className='flex items-center justify-between w-full sm:w-auto sm:gap-4'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className='flex items-center'>
                <input type='checkbox' onChange={handleSort} checked={sort} className='form-checkbox h-5 w-5 text-cyan-600'/>
                <span className='ml-2 text-gray-200'>Sort</span>
              </label>
              <motion.button
                  type='submit'
                  className='bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
            </motion.div>

          </form>

      </motion.header>

      {/* Main section for displaying movies or a loading spinner */}
      <main>
        <AnimatePresence mode='wait'>
        {loading ? 
          (
            <motion.div 
              key='loading'
              className='flex justify-center items-center h-64'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className='h-32 w-32 border-t-2 border-b-2 border-cyan-500 rounded-full'
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              </motion.div>
          ) : (
                <Movies key='movies' movies={movies || null} />
              )
        }

        </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default App;
