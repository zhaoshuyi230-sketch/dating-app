import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
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
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-indigo-50 via-white to-rose-50 relative overflow-hidden">
      {/* 顶部进度条 */}
      <div className="h-1 w-full bg-gray-200 overflow-hidden absolute top-0 left-0 right-0">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-rose-500" 
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 顶部导航栏 */}
      <div className="w-full max-w-2xl p-4 bg-white/60 mx-auto">
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

      {/* 1. 聊天记录区 (占满剩余空间，底部留白) */}
      <div className="flex-1 overflow-y-auto p-4 w-full max-w-2xl mx-auto pb-32 pt-8 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg.text} isUser={msg.isUser} index={index} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="ai-bubble p-4">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. 底部输入区 (死死钉在底部) */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-4 flex justify-center z-40">
        <div className="w-full max-w-2xl flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的回答..."
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" 
          />
          <button 
            onClick={handleSend}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
          >
            发送
          </button>
        </div>
      </div>

      {/* 3. 悬浮反馈按钮 (钉在右下角) */}
      <button 
        className="absolute right-6 bottom-24 bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl z-50 hover:bg-gray-800 transition-all"
        onClick={() => setShowModal(true)}
      >
        💬 公测反馈
      </button>
      
      {/* 4. 保留原来的 Modal 弹窗代码 */}
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
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-center mb-4">艺序 AI 恋爱避坑教练</h3>
            <p className="text-center text-gray-600 mb-6">你的每一条反馈，都在帮我构建更有温度的 AI。</p>
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">小红书二维码</span>
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="font-medium">微信号：yixu_ai</p>
              <p className="text-sm text-gray-500">或搜索：艺序 AI 恋爱避坑教练</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-indigo-500 to-rose-500 text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity btn-primary"
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