const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.getLastItem = functions.https.onRequest(async (request, res) => {
  const imagesRef = db.collection('images');
  const latestObjectsSnapshot = await imagesRef
    .orderBy('timestamp')
    .limit(1)
    .get();
  const allResults = [];
  latestObjectsSnapshot.forEach((doc) => {
    allResults.push(doc.data());
  });
  return res.send(allResults[0]);
});
