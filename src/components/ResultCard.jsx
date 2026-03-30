import React from 'react';

const ResultCard = ({ data }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-rose-50 p-8 rounded-3xl shadow-lg">
      {/* 恋爱原型 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{data.archetype.emoji} {data.archetype.name}</h1>
      </div>

      {/* 核心特质 */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {data.traits.map((trait, index) => (
          <span key={index} className="px-4 py-2 bg-white rounded-full shadow-sm">
            {trait}
          </span>
        ))}
      </div>

      {/* 偏好与红线 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-indigo-600">最契合伴侣</h2>
          <ul className="text-sm">
            {data.preferences.map((preference, index) => (
              <li key={index} className="mb-1">• {preference}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-rose-600">绝对红线</h2>
          <ul className="text-sm">
            {data.redFlags.map((flag, index) => (
              <li key={index} className="mb-1">• {flag}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI 洞察 */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <p className="italic text-gray-600 text-center">
          "{data.insight}"
        </p>
      </div>

      {/* 底部引导 */}
      <div className="text-center">
        <div className="text-xl font-bold mb-4">恋爱匹配</div>
        <button className="bg-indigo-500 text-white px-6 py-3 rounded-full font-medium">
          长按保存图片
        </button>
      </div>
    </div>
  );
};

export default ResultCard;