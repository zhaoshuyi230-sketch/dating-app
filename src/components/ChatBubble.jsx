import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message, isUser, index }) => {
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${isUser ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white' : 'bg-white/40 backdrop-blur-md border border-white/20 text-gray-800'}`}>
        <p className="leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};

export default ChatBubble;