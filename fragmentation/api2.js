const express = require('express');
const { organizeInstructions } = require('./NewOrder');
const app = express();

app.use(express.json());

app.post('/instructions', (req, res) => {
  const organizedInstructions = organizeInstructions(req.body.newOrder);
  res.send(organizedInstructions);
});

app.listen(3001, () => {
  console.log('API listening on port 3001');
});

