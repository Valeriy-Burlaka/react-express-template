
import { type Message } from '../../../backend/src/types';

export function Messages({ messages }: { messages: Message[] }) {

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-white shadow-md rounded sm:rounded-sm px-4 py-2 mb-4 overflow-hidden"
        >
          {/* <p>{message.text} {`(by ${message.author})`}</p> */}
          <p className="text-xl font-semibold">
            {message.text}
          </p>
          <p className="text-sm text-gray-600">
            {`(by ${message.author})`}
          </p>
        </div>
      ))}
    </div>
  );
}
