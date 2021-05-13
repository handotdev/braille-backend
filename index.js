const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const vision = require('@google-cloud/vision');

app.use(cors());

const upload = multer({ dest: 'uploads/' });

const options = {
  keyFilename: './credentials.json',
  projectId: 'braille-313602',
};

app.post('/api/photo/', upload.single('photo'), async (req, res) => {
  const client = new vision.ImageAnnotatorClient(options);
  const [result] = await client.labelDetection(
    `./uploads/${req.file.filename}`
  );
  const labels = result.labelAnnotations;
  const mostLikelyLabel = labels[0];
  const topDescription = mostLikelyLabel.description;
  console.log(topDescription);
  res.send({ success: true });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
