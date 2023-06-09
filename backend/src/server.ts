import { EventEmitter } from 'events';

import cors from 'cors';
import express, {
  type Request,
  type Response,
} from 'express';
import { body, validationResult } from 'express-validator';

import { idGenerator as id } from './utils/id';

import { type Message } from './types';

const eventEmitter = new EventEmitter();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

const messages = [
  { id: 'f6lc0la6k1nbb', text: 'Hi there!', author: 'Unknown', timestamp: 1682757551396 },
  { id: 'f6lc0la6k3m5l', text: 'Any news?', author: 'Unknown', timestamp: 1682790735895 },
];

const subscribedClients = new Map<string, Response>();

app.get('/messages', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  
  return res.json(messages);
});

app.post(
  '/messages',
  [
    body('text').notEmpty().withMessage('Text is required'),
    body('author').notEmpty().withMessage('Author is required'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newMessage: Message = {
      id: id(),
      text: req.body.text,
      author: req.body.author,
      timestamp: req.body.timestamp || Date.now(),
    };
    messages.push(newMessage);

    eventEmitter.emit('newMessage', newMessage);

    return res.status(201).json(newMessage);
  },
);

app.get('/messages/updates', (req: Request, res: Response) => {
  const clientId = req.header('X-Client-Id') || id();
  const existingClient = subscribedClients.get(clientId);
  if (existingClient) {
    existingClient.end();
  }
  subscribedClients.set(clientId, res);

  res.setHeader('X-Client-Id', clientId);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // // Tell the client to retry every 10 seconds if connectivity is lost
  // res.write('retry: 10000\n\n');

  const onNewMessage = (message: Message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  };
  eventEmitter.on('newMessage', onNewMessage);

  req.on('close', () => {
    subscribedClients.get(clientId)?.end();
    subscribedClients.delete(clientId);
  });
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

export default app;
