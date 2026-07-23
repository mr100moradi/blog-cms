const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Use 'post-Img' to match requested folder name
const uploadDir = path.join(__dirname, 'post-Img');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '');
    const name = `${Date.now()}_${base}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const urlPath = `/post-Img/${req.file.filename}`;
  res.json({ path: urlPath });
});

app.use('/post-Img', express.static(uploadDir));
// Backward-compat alias
app.use('/postImg', express.static(uploadDir));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});


