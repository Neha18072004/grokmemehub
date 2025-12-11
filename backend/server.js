import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'grok_secret_key_2024';

// Middleware
app.use(cors());
app.use(express.json());

// ==================== IN-MEMORY DATA STORAGE ====================
let users = [];
let memes = [];
let reactions = [];
let userIdCounter = 1;
let memeIdCounter = 1;
let reactionIdCounter = 1;

// Initialize with demo data
async function initializeData() {
  const password = await bcrypt.hash('password123', 10);
  
  // Create demo users
  users = [
    { id: 1, username: 'grok_master', email: 'grok@example.com', password, location_lat: 12.9716, location_long: 77.5946, created_at: new Date() },
    { id: 2, username: 'ai_enthusiast', email: 'ai@example.com', password, location_lat: 12.9752, location_long: 77.6030, created_at: new Date() },
    { id: 3, username: 'meme_lord', email: 'meme@example.com', password, location_lat: 12.9698, location_long: 77.5980, created_at: new Date() }
  ];
  userIdCounter = 4;

  // Create demo memes
  memes = [
    {
      id: 1,
      title: 'Grok Solving World Hunger with Puns',
      caption: 'When Grok decides every problem needs a dad joke solution 😂 #AIHumor',
      image_url: 'https://via.placeholder.com/600x400/667eea/ffffff?text=Grok+Puns',
      category: 'Grok',
      uploader_id: 1,
      uploader_name: 'grok_master',
      created_at: new Date()
    },
    {
      id: 2,
      title: 'AI Training on Cat Videos',
      caption: 'Me: Train on academic papers. AI: But have you considered... cats? 🐱',
      image_url: 'https://via.placeholder.com/600x400/764ba2/ffffff?text=AI+Cats',
      category: 'AI',
      uploader_id: 2,
      uploader_name: 'ai_enthusiast',
      created_at: new Date()
    },
    {
      id: 3,
      title: 'xAI Launch Day',
      caption: 'Everyone: What will xAI do? Grok: Hold my neural network 🚀',
      image_url: 'https://via.placeholder.com/600x400/f093fb/ffffff?text=xAI+Launch',
      category: 'xAI',
      uploader_id: 1,
      uploader_name: 'grok_master',
      created_at: new Date()
    },
    {
      id: 4,
      title: 'The Future is Now',
      caption: 'Living in 3024 where AI makes memes about making memes 🤖',
      image_url: 'https://via.placeholder.com/600x400/4facfe/ffffff?text=Future+AI',
      category: 'Futuristic',
      uploader_id: 3,
      uploader_name: 'meme_lord',
      created_at: new Date()
    },
    {
      id: 5,
      title: 'Debugging AI Models',
      caption: 'Error: Success. Wait, that cant be right... 🐛',
      image_url: 'https://via.placeholder.com/600x400/00f2fe/ffffff?text=Debugging',
      category: 'AI',
      uploader_id: 2,
      uploader_name: 'ai_enthusiast',
      created_at: new Date()
    },
    {
      id: 6,
      title: 'Grok Learning Sarcasm',
      caption: 'Grok: I understand sarcasm perfectly. Also Grok: Takes everything literally',
      image_url: 'https://via.placeholder.com/600x400/43e97b/ffffff?text=Sarcasm',
      category: 'Grok',
      uploader_id: 1,
      uploader_name: 'grok_master',
      created_at: new Date()
    },
    {
      id: 7,
      title: 'Neural Network Dreams',
      caption: 'What AI sees when it closes its... wait, does AI blink? 👁️',
      image_url: 'https://via.placeholder.com/600x400/38f9d7/ffffff?text=AI+Dreams',
      category: 'AI',
      uploader_id: 3,
      uploader_name: 'meme_lord',
      created_at: new Date()
    },
    {
      id: 8,
      title: 'Prompt Engineering 101',
      caption: 'Me: Simple question. AI: *Writes PhD thesis* Close enough! 📚',
      image_url: 'https://via.placeholder.com/600x400/fa709a/ffffff?text=Prompt+Eng',
      category: 'General',
      uploader_id: 2,
      uploader_name: 'ai_enthusiast',
      created_at: new Date()
    }
  ];
  memeIdCounter = 9;

  // Add some reactions
  reactions = [
    { id: 1, meme_id: 1, user_id: 2, reaction_type: 'laugh', created_at: new Date() },
    { id: 2, meme_id: 1, user_id: 3, reaction_type: 'robot', created_at: new Date() },
    { id: 3, meme_id: 2, user_id: 1, reaction_type: 'fire', created_at: new Date() },
    { id: 4, meme_id: 3, user_id: 2, reaction_type: 'mind_blown', created_at: new Date() }
  ];
  reactionIdCounter = 5;
}

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (users.find(u => u.email === email || u.username === username)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password: hashedPassword,
      location_lat: req.body.location_lat || null,
      location_long: req.body.location_long || null,
      created_at: new Date()
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, username, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id, username, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
});

// ==================== MEME ROUTES ====================

// Get all memes with filters
app.get('/api/memes', (req, res) => {
  const { search, category, sort } = req.query;
  let filteredMemes = [...memes];

  // Search filter
  if (search) {
    filteredMemes = filteredMemes.filter(m => 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.caption.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Category filter
  if (category && category !== 'all') {
    filteredMemes = filteredMemes.filter(m => m.category === category);
  }

  // Add reaction counts
  filteredMemes = filteredMemes.map(meme => ({
    ...meme,
    reaction_count: reactions.filter(r => r.meme_id === meme.id).length
  }));

  // Sort
  if (sort === 'trending') {
    filteredMemes.sort((a, b) => b.reaction_count - a.reaction_count);
  } else if (sort === 'oldest') {
    filteredMemes.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else {
    filteredMemes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  res.json({ success: true, count: filteredMemes.length, memes: filteredMemes });
});

// Get single meme
app.get('/api/memes/:id', (req, res) => {
  const meme = memes.find(m => m.id === parseInt(req.params.id));
  if (!meme) {
    return res.status(404).json({ success: false, message: 'Meme not found' });
  }

  const memeReactions = reactions.filter(r => r.meme_id === meme.id);
  const reactionsBreakdown = {};
  memeReactions.forEach(r => {
    reactionsBreakdown[r.reaction_type] = (reactionsBreakdown[r.reaction_type] || 0) + 1;
  });

  res.json({
    success: true,
    meme: {
      ...meme,
      reaction_count: memeReactions.length,
      reactions_breakdown: reactionsBreakdown
    }
  });
});

// Get user's memes
app.get('/api/memes/user/:userId', (req, res) => {
  const userMemes = memes.filter(m => m.uploader_id === parseInt(req.params.userId));
  const memesWithReactions = userMemes.map(meme => ({
    ...meme,
    reaction_count: reactions.filter(r => r.meme_id === meme.id).length
  }));
  res.json({ success: true, count: memesWithReactions.length, memes: memesWithReactions });
});

// Create meme
app.post('/api/memes', authMiddleware, (req, res) => {
  const { title, caption, category, image_url } = req.body;
  
  if (!title || !caption || !image_url) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const user = users.find(u => u.id === req.user.id);
  const newMeme = {
    id: memeIdCounter++,
    title,
    caption,
    image_url,
    category: category || 'General',
    uploader_id: req.user.id,
    uploader_name: user.username,
    created_at: new Date()
  };

  memes.push(newMeme);
  res.status(201).json({ success: true, meme: newMeme });
});

// Update meme
app.put('/api/memes/:id', authMiddleware, (req, res) => {
  const memeIndex = memes.findIndex(m => m.id === parseInt(req.params.id));
  if (memeIndex === -1) {
    return res.status(404).json({ success: false, message: 'Meme not found' });
  }

  if (memes[memeIndex].uploader_id !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const { title, caption, category } = req.body;
  memes[memeIndex] = { ...memes[memeIndex], title, caption, category };

  res.json({ success: true, meme: memes[memeIndex] });
});

// Delete meme
app.delete('/api/memes/:id', authMiddleware, (req, res) => {
  const memeIndex = memes.findIndex(m => m.id === parseInt(req.params.id));
  if (memeIndex === -1) {
    return res.status(404).json({ success: false, message: 'Meme not found' });
  }

  if (memes[memeIndex].uploader_id !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  memes.splice(memeIndex, 1);
  reactions = reactions.filter(r => r.meme_id !== parseInt(req.params.id));

  res.json({ success: true, message: 'Meme deleted' });
});

// ==================== REACTION ROUTES ====================

// Get reactions for meme
app.get('/api/reactions/meme/:memeId', (req, res) => {
  const memeReactions = reactions.filter(r => r.meme_id === parseInt(req.params.memeId));
  const counts = {};
  memeReactions.forEach(r => {
    counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
  });

  res.json({ success: true, reactions: memeReactions, counts });
});

// Add/update reaction
app.post('/api/reactions', authMiddleware, (req, res) => {
  const { meme_id, reaction_type } = req.body;

  const existingIndex = reactions.findIndex(r => r.meme_id === meme_id && r.user_id === req.user.id);

  if (existingIndex !== -1) {
    if (reactions[existingIndex].reaction_type === reaction_type) {
      // Remove reaction
      reactions.splice(existingIndex, 1);
      const counts = {};
      reactions.filter(r => r.meme_id === meme_id).forEach(r => {
        counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
      });
      return res.json({ success: true, message: 'Reaction removed', reaction: null, counts });
    } else {
      // Update reaction
      reactions[existingIndex].reaction_type = reaction_type;
    }
  } else {
    // Add new reaction
    reactions.push({
      id: reactionIdCounter++,
      meme_id,
      user_id: req.user.id,
      reaction_type,
      created_at: new Date()
    });
  }

  const counts = {};
  reactions.filter(r => r.meme_id === meme_id).forEach(r => {
    counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
  });

  res.json({ success: true, message: 'Reaction added', reaction: { meme_id, reaction_type }, counts });
});

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'GrokMemeHub API is running!', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to GrokMemeHub API',
    version: '1.0.0',
    endpoints: {
      auth: { register: 'POST /api/auth/register', login: 'POST /api/auth/login' },
      memes: { getAll: 'GET /api/memes', create: 'POST /api/memes' },
      reactions: { add: 'POST /api/reactions' }
    }
  });
});

// Initialize data and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║     🚀 GrokMemeHub API Running (In-Memory)    ║
║                                               ║
║     Port: ${PORT}                            ║
║     Users: ${users.length}                                   ║
║     Memes: ${memes.length}                                   ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);
  });
});
