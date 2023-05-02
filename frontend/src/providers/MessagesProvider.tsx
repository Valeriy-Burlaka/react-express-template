import { createContext, useContext, useState } from 'react';

import { type Message } from '../../../backend/src/types';

interface MessagesContextValue {
  messages: Message[];
  addMessage: (msg: Message) => void;
}

const MessagesContext = createContext<MessagesContextValue>({
  messages: [],
  addMessage: () => {},
});

export const useMessages = () => {
  return useContext(MessagesContext);
};

export const MessagesProvider = ({
  initialMessages,
  children,
}: {
  initialMessages: MessagesContextValue['messages'],
  children: React.ReactNode,
}) => {
  const [messages, setMessages] = useState<MessagesContextValue['messages']>(initialMessages);

  const sortMessagesNewestLast = (a: Message, b: Message) => a.timestamp - b.timestamp;
  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => {
      if (prevMessages.some((msg) => msg.id === newMessage.id)) {
        return prevMessages;
      }

      return [...prevMessages, newMessage].sort(sortMessagesNewestLast);
    });
  };

  return (
    <MessagesContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessagesContext.Provider>
  );
};
