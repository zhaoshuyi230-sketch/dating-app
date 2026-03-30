import React from 'react';

const ResultCard = ({ data }) => {
  // 根据恋爱原型关键词动态切换卡片的渐变背景色
  const getCardGradient = () => {
    const archetypeName = data.archetype.name;
    if (archetypeName.includes('守望者')) {
      return 'linear-gradient(to bottom right, #fdf2f8, #fbcfe8)'; // 莫兰迪粉
    } else if (archetypeName.includes('探险家')) {
      return 'linear-gradient(to bottom right, #f3f4f6, #dbeafe)'; // 高级灰蓝
    } else if (archetypeName.includes('直球派')) {
      return 'linear-gradient(to bottom right, #eeeffe, #e0e7ff)'; // 靛蓝紫
    } else if (archetypeName.includes('浪漫')) {
      return 'linear-gradient(to bottom right, #fff1f2, #fecdd3)'; // 浪漫粉
    } else if (archetypeName.includes('理性')) {
      return 'linear-gradient(to bottom right, #eff6ff, #dbeafe)'; // 理性蓝
    } else {
      return 'linear-gradient(to bottom right, #eeeffe, #fff1f2)'; // 默认渐变
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl shadow-xl relative overflow-hidden" style={{ background: getCardGradient() }}>
      {/* 毛玻璃效果叠加层 */}
      <div className="absolute inset-0 bg-white/30 rounded-3xl"></div>
      
      {/* 内容容器 */}
      <div className="relative z-10">
        {/* 恋爱原型 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{data.archetype.emoji} {data.archetype.name}</h1>
        </div>

        {/* 核心特质 */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {data.traits.map((trait, index) => (
            <span key={index} className="px-4 py-2 bg-white/80 rounded-full shadow-sm">
              {trait}
            </span>
          ))}
        </div>

        {/* 偏好与红线 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-indigo-600">最契合伴侣</h2>
            <ul className="text-sm">
              {data.preferences.map((preference, index) => (
                <li key={index} className="mb-1">• {preference}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white/80 p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-rose-600">绝对红线</h2>
            <ul className="text-sm">
              {data.redFlags.map((flag, index) => (
                <li key={index} className="mb-1">• {flag}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* AI 洞察 */}
        <div className="bg-white/80 p-6 rounded-xl shadow-sm mb-8">
          <p className="italic text-gray-600 text-center">
            "{data.insight}"
          </p>
        </div>

        {/* 底部引导 */}
        <div className="text-center">
          <div className="text-xl font-bold mb-4">恋爱匹配</div>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow">
            长按保存图片
          </button>
        </div>
      </div>

      {/* 品牌水印 */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 z-10">
        yixu-ai.com | AI恋爱避坑教练
      </div>
    </div>
  );
};

export default ResultCard;