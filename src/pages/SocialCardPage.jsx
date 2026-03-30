import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import ResultCard from '../components/ResultCard';

const SocialCardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isDeepReportOpen, setIsDeepReportOpen] = useState(false);
  const data = location.state || {
    archetype: { emoji: '🎯', name: '温和的直球派' },
    traits: ['情绪稳定', '高能效社交', '真诚坦率', '有责任感'],
    preferences: ['善解人意', '有共同兴趣', '积极向上', '尊重他人'],
    redFlags: ['不诚实', '消极抱怨', '没有上进心', '不尊重边界'],
    insight: '你是一个真诚坦率的人，重视稳定的情感关系。你理想的伴侣是能够与你共同成长，相互理解和支持的人。'
  };

  // 模拟生成的走心长文
  const deepInsight = '基于你的性格特质和恋爱偏好，我发现你是一个非常注重情感连接的人。你的情绪稳定性让你在关系中能够保持理性，而真诚坦率的性格则让你在与伴侣相处时更加真实。在寻找伴侣时，你倾向于选择与自己价值观相似的人，这是非常明智的选择。不过，有时候你可能会过于追求完美，给自己和对方带来不必要的压力。记住，一段健康的关系需要双方的共同努力和包容。';

  // 保存卡片为图片
  const handleSaveCard = async () => {
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = '恋爱匹配卡片.png';
        link.href = image;
        link.click();
      } catch (error) {
        console.error('保存图片失败:', error);
      }
    }
  };

  // 再次访谈
  const handleInterviewAgain = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 items-center p-4 py-8">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResultCard data={data} />
      </motion.div>
      
      {/* 优化后的保存卡片按钮 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={handleSaveCard}
        className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        保存卡片
      </motion.button>
      
      {/* 解锁深度报告折叠区 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 w-full max-w-md"
      >
        <button
          onClick={() => setIsDeepReportOpen(!isDeepReportOpen)}
          className="w-full bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
        >
          <span className="font-semibold text-indigo-600">解锁深度报告</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-indigo-600 transition-transform duration-300 ${isDeepReportOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDeepReportOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-2 bg-white rounded-xl shadow-md p-4"
          >
            {/* AI 恋爱避坑教练 */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">AI 恋爱避坑教练</h3>
                <p className="text-sm text-gray-600">嗨！我是你的专属恋爱教练，让我来帮你解锁更多恋爱洞察。</p>
              </div>
            </div>
            
            {/* 模糊预览版块 */}
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg blur-sm">
                <h4 className="font-semibold text-gray-700 mb-2">性格底色深度剖析</h4>
                <p className="text-sm">{deepInsight}</p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg blur-sm">
                <h4 className="font-semibold text-gray-700 mb-2">潜在避坑指南</h4>
                <p className="text-sm">{deepInsight}</p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg blur-sm">
                <h4 className="font-semibold text-gray-700 mb-2">专属约会攻略</h4>
                <p className="text-sm">{deepInsight}</p>
              </div>
            </div>
            
            {/* 解锁提示 */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-sm text-yellow-700">分享卡片至朋友圈或模拟付费后解锁完整深度报告</p>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* 再次访谈按钮 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        onClick={handleInterviewAgain}
        className="mt-8 bg-white border border-indigo-500 text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-indigo-50 transition-colors duration-300"
      >
        再次访谈
      </motion.button>
    </div>
  );
};

export default SocialCardPage;