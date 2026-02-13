const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3847;
const BRAIN_ROOT = path.resolve(process.env.HOME, 'clawd/brain');
const TOKEN = process.env.FILE_BROWSER_TOKEN || '2f78dad1dad370ceed79b53620c59cbb7620d2818e53dc54';

app.use(cors({
  origin: [
    'https://mission-control-zeta-livid.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
  ],
  credentials: true,
}));
app.use(express.json());

// Auth middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || header !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Resolve and validate path stays within BRAIN_ROOT
function safePath(relPath) {
  const resolved = path.resolve(BRAIN_ROOT, relPath || '');
  if (!resolved.startsWith(BRAIN_ROOT)) return null;
  return resolved;
}

// List directory
app.get('/api/files', auth, (req, res) => {
  const dir = safePath(req.query.path || '');
  if (!dir) return res.status(403).json({ error: 'Path traversal denied' });
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter(e => !e.name.startsWith('.'))
      .map(e => {
        const fullPath = path.join(dir, e.name);
        const stat = fs.statSync(fullPath);
        return {
          name: e.name,
          type: e.isDirectory() ? 'dir' : 'file',
          size: stat.size,
          modified: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    res.json({ path: path.relative(BRAIN_ROOT, dir), files });
  } catch (err) {
    res.status(404).json({ error: 'Directory not found' });
  }
});

// Read file
app.get('/api/file', auth, (req, res) => {
  const filePath = safePath(req.query.path || '');
  if (!filePath) return res.status(403).json({ error: 'Path traversal denied' });
  
  try {
    const ext = path.extname(filePath).toLowerCase();
    const textExts = ['.md', '.txt', '.json', '.yaml', '.yml', '.toml', '.env', '.js', '.ts', '.py', '.sh', '.css', '.html', '.csv'];
    
    if (textExts.includes(ext)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      res.json({ type: 'text', content, name: path.basename(filePath) });
    } else {
      const content = fs.readFileSync(filePath).toString('base64');
      res.json({ type: 'binary', content, name: path.basename(filePath), mimeType: ext });
    }
  } catch (err) {
    res.status(404).json({ error: 'File not found' });
  }
});

// Write file
app.post('/api/file', auth, (req, res) => {
  const { path: relPath, content } = req.body;
  const filePath = safePath(relPath);
  if (!filePath) return res.status(403).json({ error: 'Path traversal denied' });
  
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete file
app.delete('/api/file', auth, (req, res) => {
  const filePath = safePath(req.query.path || '');
  if (!filePath) return res.status(403).json({ error: 'Path traversal denied' });
  
  try {
    // Try trash command first (macOS)
    const { execSync } = require('child_process');
    try {
      execSync(`trash "${filePath}"`);
    } catch {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`File browser API running on http://localhost:${PORT}`);
});
