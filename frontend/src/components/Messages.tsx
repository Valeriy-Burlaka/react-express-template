
import { type Message } from '../../../backend/src/types';

export function Messages({ messages }: { messages: Message[] }) {

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>{message.text} {`(by ${message.author})`}</p>
        </div>
      ))}
    </div>
  );
}
