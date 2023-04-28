import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

const messages = [
  { text: 'Hi there!', author: 'Unknown', timestamp: new Date() },
  { text: 'Any news?', author: 'Unknown', timestamp: new Date() },
];

app.get('/messages', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  return res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
