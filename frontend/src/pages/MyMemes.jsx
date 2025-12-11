import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MemeCard from '../components/MemeCard';

const MyMemes = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyMemes();
    }
  }, [user]);

  const fetchMyMemes = async () => {
    try {
      const response = await axios.get(`/api/memes/user/${user.id}`);
      if (response.data.success) {
        setMemes(response.data.memes);
      }
    } catch (error) {
      console.error('Fetch my memes error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">
          <i className="fas fa-images mr-3"></i>My Memes
        </h1>
        <Link to="/upload" className="btn-primary">
          <i className="fas fa-plus mr-2"></i>Upload New
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner"></div>
        </div>
      ) : memes.length === 0 ? (
        <div className="text-center py-20">
          <i className="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-2xl font-bold mb-2">No memes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start sharing your AI memes!</p>
          <Link to="/upload" className="btn-primary">Upload Your First Meme</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMemes;
