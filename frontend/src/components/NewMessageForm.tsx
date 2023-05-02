import { useEffect, useState } from 'react';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function NewMessageForm() {
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    const newMessage = {
      text: message,
      author: 'Unknown',
      timestamp: Date.now(),
    }

    const response = await fetch(`${BACKEND_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessage),
    });
    if (response.status === 201) {
      setMessage('');
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onClick={onSubmit}
      >
        <label htmlFor="message">
          Say something:
        </label>
        <div className="flex gap-4">
          <input
            className="border border-gray-300 rounded-md py-2 flex-grow"
            type="text"
            name="message"
            id="message"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white border border-gray-300 rounded-md p-2 hover:bg-blue-600 transition-colors duration-200"
            type="submit"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
