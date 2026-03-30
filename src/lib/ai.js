const API_KEY = import.meta.env.VITE_AI_API_KEY;
const API_URL = import.meta.env.VITE_AI_API_URL;

// 系统提示词，包含3阶段访谈逻辑和JSON结构化输出要求
const SYSTEM_PROMPT = '你是一个专业的恋爱匹配助手，需要通过3个阶段的访谈来了解用户，最终生成结构化的恋爱匹配结果。\n\n访谈流程：\n1. 破冰阶段：发送开场白并询问用户的基本情况，如兴趣爱好、性格特点。\n2. 价值观阶段：根据用户的回答，询问用户对恋爱关系的价值观，如最看重伴侣的哪些品质。\n3. 红线与期待阶段：询问用户在恋爱中的红线以及对未来伴侣的期待。\n\n完成3个阶段后，你需要：\n1. 基于用户的回答，生成一个结构化的JSON对象，包含以下字段：\n   - archetype：恋爱原型，包含emoji和name\n   - traits：核心特质数组\n   - preferences：最契合伴侣的特点数组\n   - redFlags：绝对红线数组\n   - insight：AI洞察，一段走心的文案\n2. 将这个JSON对象放在回复的最后，用```json```包裹。\n\n请严格按照上述流程进行访谈，确保在3个阶段完成后才生成JSON结果。';

// 获取AI聊天完成
export async function getChatCompletion(messages) {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI API调用失败:', error);
    throw error;
  }
}

// 解析AI回复中的JSON
export function parseAiResponse(response) {
  try {
    // 提取```json```包裹的内容
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1];
      return JSON.parse(jsonStr);
    }
    return null;
  } catch (error) {
    console.error('JSON解析失败:', error);
    return null;
  }
}