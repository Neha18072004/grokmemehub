import { useState } from 'react';
import axios from 'axios';
import MemeCard from '../components/MemeCard';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await axios.get(`/api/memes?search=${encodeURIComponent(searchTerm)}`);
      if (response.data.success) {
        setMemes(response.data.memes);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold gradient-text mb-8">
        <i className="fas fa-search mr-3"></i>Search Memes
      </h1>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
            placeholder="Search by title or caption..."
          />
          <button type="submit" className="btn-primary">Search</button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner"></div>
        </div>
      ) : hasSearched ? (
        memes.length === 0 ? (
          <div className="text-center py-20">
            <i className="fas fa-search text-6xl text-gray-400 mb-4"></i>
            <p className="text-xl">No memes found for "{searchTerm}"</p>
          </div>
        ) : (
          <>
            <p className="text-center mb-6">Found {memes.length} meme{memes.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memes.map((meme) => (
                <MemeCard key={meme.id} meme={meme} />
              ))}
            </div>
          </>
        )
      ) : (
        <div className="text-center py-20">
          <i className="fas fa-search text-6xl gradient-text mb-4"></i>
          <p className="text-xl">Enter a search term to find memes</p>
        </div>
      )}
    </div>
  );
};

export default Search;
