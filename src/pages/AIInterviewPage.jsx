import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatBubble from '../components/ChatBubble';
import { getChatCompletion, parseAiResponse } from '../lib/ai';

const AIInterviewPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingRef = useRef(null);

  // 初始化对话
  useEffect(() => {
    const initialMessage = '你好！我是你的恋爱匹配助手。让我们通过几个问题来了解你，为你找到最契合的伴侣。';
    setMessages([{ text: '', isUser: false }]);
    
    // 打字机效果
    let index = 0;
    let currentText = '';
    const typingInterval = setInterval(() => {
      if (index < initialMessage.length) {
        currentText += initialMessage[index];
        setTypingText(currentText);
        setMessages(prev => [
          ...prev.slice(0, -1),
          { text: currentText, isUser: false }
        ]);
        index++;
      } else {
        clearInterval(typingInterval);
        setShowFullText(true);
        // 发送第一个问题
        setTimeout(() => {
          const firstQuestion = '首先，能否简单介绍一下你自己？比如你的兴趣爱好、性格特点。';
          setMessages(prev => [...prev, { text: firstQuestion, isUser: false }]);
        }, 1000);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 模拟进度条
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      {/* 顶部进度条 */}
      <div className="h-1 w-full bg-gray-200 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-rose-500" 
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 顶部导航栏 */}
      <div className="p-4 backdrop-blur-md bg-white/60">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${messages.length >= 1 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-1 ${messages.length >= 3 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${messages.length >= 3 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-1 ${messages.length >= 5 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full ${messages.length >= 5 ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>

      {/* 主聊天气泡区 */}
      <div className="flex-1 p-4 overflow-y-auto backdrop-blur-md bg-white/60">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="backdrop-blur-md bg-white/80 p-4 rounded-2xl shadow-sm">
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
      <div className="p-4 backdrop-blur-md bg-white/60 border-t border-gray-200/50">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的回答..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md bg-white/80"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* 右下角悬浮按钮 */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-medium">公测反馈</span>
      </motion.button>

      {/* 弹窗 */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-center mb-4">加入首批公测社群</h3>
            <p className="text-center text-gray-600 mb-6">解锁 1 对 1 AI 避坑指导</p>
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">二维码</span>
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="font-medium">微信号：yixu_ai</p>
              <p className="text-sm text-gray-500">或搜索：AI 恋爱避坑教练</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              关闭
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AIInterviewPage;