import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Upload = () => {
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'General',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/memes', formData);
      if (response.data.success) {
        navigate('/my-memes');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload meme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-6">
          <i className="fas fa-upload mr-3"></i>Upload New Meme
        </h1>

        <div className="card p-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://example.com/meme.jpg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Try: https://via.placeholder.com/600x400/667eea/ffffff?text=My+Meme
              </p>
            </div>

            {formData.image_url && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Preview:</p>
                <img src={formData.image_url} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
                maxLength={255}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Caption (Max 140 characters)</label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                className="input-field"
                rows="3"
                required
                maxLength={140}
              ></textarea>
              <p className="text-xs text-gray-500 mt-1 text-right">{formData.caption.length}/140</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                <option value="General">General</option>
                <option value="AI">AI</option>
                <option value="Grok">Grok</option>
                <option value="xAI">xAI</option>
                <option value="Futuristic">Futuristic</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? 'Uploading...' : '🚀 Share Meme'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
