import { useEffect } from 'react';

import { useMessages } from 'src/providers/MessagesProvider';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function Messages() {
  const { messages, addMessage } = useMessages();

  useEffect(() => {
    console.log('Subscribing to message updates...');
    const eventSource = new EventSource(`${BACKEND_URL}/messages/updates`);

    eventSource.onmessage = (event) => {
      console.log('Event data:', event.data);
      const newMessage = JSON.parse(event.data);

      addMessage(newMessage);
    }

    return () => eventSource.close();
  }, []);

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-white shadow-md rounded sm:rounded-sm px-4 py-2 mb-4 overflow-hidden"
        >
          <p className="text-xl font-semibold">
            {message.text} {message.id}
          </p>
          <p className="text-sm text-gray-600">
            {`${new Date(message.timestamp).toLocaleString()} - by ${message.author}`}
          </p>
        </div>
      ))}
    </div>
  );
}
