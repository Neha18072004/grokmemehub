import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MemeDetail = () => {
  const { id } = useParams();
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeme();
  }, [id]);

  const fetchMeme = async () => {
    try {
      const response = await axios.get(`/api/memes/${id}`);
      if (response.data.success) {
        setMeme(response.data.meme);
      }
    } catch (error) {
      console.error('Fetch meme error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Meme Not Found</h2>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-grok-light hover:text-grok-dark mb-6">
        <i className="fas fa-arrow-left mr-2"></i>Back
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="card overflow-hidden">
          <img src={meme.image_url} alt={meme.title} className="w-full h-96 object-cover" />
          
          <div className="p-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {meme.category}
            </span>

            <h1 className="text-3xl font-bold mb-4">{meme.title}</h1>
            <p className="text-lg mb-6">{meme.caption}</p>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Posted by <span className="font-semibold">{meme.uploader_name}</span> on {new Date(meme.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetail;
