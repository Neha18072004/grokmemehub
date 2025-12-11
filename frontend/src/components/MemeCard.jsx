import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MemeCard = ({ meme, onReactionUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [reactions, setReactions] = useState(meme.reactions_breakdown || {});
  const [isReacting, setIsReacting] = useState(false);

  const reactionIcons = {
    laugh: '😂', robot: '🤖', think: '🤔', fire: '🔥', mind_blown: '🤯'
  };

  const categoryColors = {
    AI: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Grok: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    xAI: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    Futuristic: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    General: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  const handleReaction = async (reactionType) => {
    if (!isAuthenticated) {
      alert('Please login to react to memes');
      return;
    }
    if (isReacting) return;

    try {
      setIsReacting(true);
      const response = await axios.post('/api/reactions', {
        meme_id: meme.id,
        reaction_type: reactionType
      });

      if (response.data.success) {
        setReactions(response.data.counts || {});
        if (onReactionUpdate) {
          onReactionUpdate(meme.id, response.data.counts);
        }
      }
    } catch (error) {
      console.error('Reaction error:', error);
    } finally {
      setIsReacting(false);
    }
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + (count || 0), 0);

  return (
    <div className="card hover:transform hover:-translate-y-1 transition-transform duration-200">
      <Link to={`/meme/${meme.id}`} className="block relative group overflow-hidden">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${categoryColors[meme.category] || categoryColors.General}`}>
          {meme.category}
        </span>

        <Link to={`/meme/${meme.id}`}>
          <h3 className="text-lg font-bold mb-2 hover:text-grok-light line-clamp-2">{meme.title}</h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{meme.caption}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span><i className="fas fa-user mr-1"></i>{meme.uploader_name || 'Anonymous'}</span>
          <span><i className="fas fa-clock mr-1"></i>{new Date(meme.created_at).toLocaleDateString()}</span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">
              <i className="fas fa-heart mr-1"></i>{totalReactions} Reactions
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(reactionIcons).map(([type, icon]) => (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                disabled={isReacting}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all transform hover:scale-110"
              >
                <span className="text-lg">{icon}</span>
                {reactions[type] > 0 && <span className="font-bold">{reactions[type]}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
