
import { GoogleGenAI, Type } from "@google/genai";
import { NutrientInfo } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeMealImage(base64Image: string): Promise<{ foodName: string; nutrients: NutrientInfo }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: "识别这张照片中的食物，估计其体积和重量，并提供营养分析。请以 JSON 格式返回。字段包括: foodName (食物名称), calories (卡路里kcal), protein (蛋白质g), fat (脂肪g), carbs (碳水g), weight (估计重量g)。"
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          fat: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          weight: { type: Type.NUMBER }
        },
        required: ["foodName", "calories", "protein", "fat", "carbs", "weight"]
      }
    }
  });

  return JSON.parse(response.text);
}

// Improved generateWeeklyTasks to use structured JSON output with responseSchema
export async function generateWeeklyTasks(history: any[], profile: any) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `基于用户过去一周的饮食历史: ${JSON.stringify(history)} 和 个人目标: ${JSON.stringify(profile)}，生成3个针对下一周的饮食健康任务。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetValue: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              enum: ['calories', 'protein', 'veg', 'water', 'sugar']
            }
          },
          required: ["title", "targetValue", "unit", "category"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("AI Task Generation failed to parse JSON:", e);
    return [];
  }
}
