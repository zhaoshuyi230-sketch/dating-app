import React from 'react';

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] p-4 rounded-2xl ${isUser ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;