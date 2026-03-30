import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '../components/ChatBubble';
import { getChatCompletion, parseAiResponse } from '../lib/ai';

const AIInterviewPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // 初始化对话
  useEffect(() => {
    const initialMessage = '你好！我是你的恋爱匹配助手。让我们通过几个问题来了解你，为你找到最契合的伴侣。';
    setMessages([{ text: initialMessage, isUser: false }]);
    
    // 发送第一个问题
    setTimeout(() => {
      const firstQuestion = '首先，能否简单介绍一下你自己？比如你的兴趣爱好、性格特点。';
      setMessages(prev => [...prev, { text: firstQuestion, isUser: false }]);
    }, 1000);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理用户发送消息
  const handleSend = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput('');
    setIsLoading(true);

    try {
      // 调用真实的 AI API
      const aiResponse = await getChatCompletion(messages.concat({ text: input, isUser: true }));
      setMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      
      // 尝试解析 JSON 结果
      const resultData = parseAiResponse(aiResponse);
      if (resultData) {
        // 解析成功，跳转到结果页
        navigate('/result', { state: resultData });
      }
    } catch (error) {
      console.error('AI 调用失败:', error);
      // 显示错误消息
      setMessages(prev => [...prev, { text: '抱歉，AI 助手暂时无法响应，请稍后再试。', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="p-4 border-b flex justify-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${messages.length >= 1 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-1 ${messages.length >= 3 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${messages.length >= 3 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-1 ${messages.length >= 5 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${messages.length >= 5 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {/* 主聊天气泡区 */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 p-4 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入区 */}
      <div className="p-4 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的回答..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewPage;