import { motion, AnimatePresence } from 'framer-motion';

// Movie interface to define the structure of a movie object
interface Movie {
  id: string
  title: string
  year: string
  image: string
};

// Props for the list of movies component
interface ListOfMoviesProps {
  movies: Movie[]
};

// Props for the main Movies component, which can accept either a list of movies or null
interface MoviesProps {
  movies: Movie[] | null
};

// Component for displaying a list of movies
function ListOfMovies ({ movies }: ListOfMoviesProps): JSX.Element {
  return (
    <motion.ul 
      className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {
        movies.map(movie => (
          <motion.li 
          key={movie.id} 
          className='bg-cyan-600 rounded-lg shadow-md overflow-hidden'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
            {/* Display movie image */}
            <img src={movie.image} alt={movie.title} className='w-full h-48 object-cover'/>
            <div className='p-4'>
              <h3 className='text-lg font-semibold text-gray-200 mb-1'>{movie.title}</h3>
              <p className='text-sm text-gray-300'>{movie.year}</p>
            </div>
          </motion.li>
        ))
      }
    </motion.ul>
  )
};

// Component that shows a message when no movies are found
function NoMoviesResults (): JSX.Element {
  return (
    <motion.p 
      className='text-center text-gray-200 mt-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      No movies were found for this search
    </motion.p>
  )
};

// Main Movies component that conditionally renders either the list of movies or a "no results" message
export function Movies ({ movies }: MoviesProps): JSX.Element { 
  // Check if there are movies to display
  const hasMovies = movies !== null && movies.length > 0

  return (
    <AnimatePresence>
      {hasMovies
        ? <ListOfMovies movies={movies ?? []} />
        : movies !== null && <NoMoviesResults />
      }
    </AnimatePresence>
  )
};