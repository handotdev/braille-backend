const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const admin = require('firebase-admin');
const firebaseCredentials = require('./firebaseCredentials.json');

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials),
});

const db = admin.firestore();

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

  const imagesRef = db.collection('images');

  await imagesRef.add({
    item: topDescription,
    timestamp: admin.firestore.Timestamp.now(),
  });

  res.send({ success: true, object: topDescription });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
