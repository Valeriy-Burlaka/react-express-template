import express, {
  type Request,
  type Response,
} from 'express';

import { idGenerator as id } from './utils/id';

import { type Message } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const messages = [
  { id: id(), text: 'Hi there!', author: 'Unknown', timestamp: Date.now() },
  { id: id(), text: 'Any news?', author: 'Unknown', timestamp: Date.now() },
];

app.get('/messages', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  
  return res.json(messages);
});

app.post('/messages', (req: Request, res: Response) => {
  const newMessage: Message = {
    id: id(),
    text: req.body.text,
    author: req.body.author,
    timestamp: req.body.timestamp || Date.now(),
  };
  messages.push(newMessage);

  return res.status(201).json(newMessage);
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
