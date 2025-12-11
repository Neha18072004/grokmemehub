import { useState, useEffect } from 'react';
import axios from 'axios';
import MemeCard from '../components/MemeCard';

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchMemes();
  }, [filter, category]);

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === 'trending') params.append('sort', 'trending');
      if (filter === 'oldest') params.append('sort', 'oldest');
      if (category !== 'all') params.append('category', category);

      const response = await axios.get(`/api/memes?${params}`);
      if (response.data.success) {
        setMemes(response.data.memes);
      }
    } catch (error) {
      console.error('Fetch memes error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-grok-light via-purple-500 to-grok-dark text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to GrokMemeHub! 🤖</h1>
          <p className="text-xl md:text-2xl">Where AI meets hilarious memes</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field">
              <option value="latest">Latest</option>
              <option value="trending">Trending</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
              <option value="all">All Categories</option>
              <option value="AI">AI</option>
              <option value="Grok">Grok</option>
              <option value="xAI">xAI</option>
              <option value="Futuristic">Futuristic</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-20">
            <i className="fas fa-sad-tear text-6xl text-gray-400 mb-4"></i>
            <p className="text-xl text-gray-600 dark:text-gray-400">No memes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
