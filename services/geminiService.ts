
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    sentiment: {
      type: Type.OBJECT,
      properties: {
        positive: { type: Type.NUMBER },
        negative: { type: Type.NUMBER },
        neutral: { type: Type.NUMBER },
      },
      required: ['positive', 'negative', 'neutral'],
    },
    keyNarratives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          narrative: { type: Type.STRING },
          volume: { type: Type.NUMBER },
        },
        required: ['narrative', 'volume'],
      },
    },
    platformBreakdown: {
      type: Type.OBJECT,
      properties: {
        twitter: { type: Type.NUMBER },
        facebook: { type: Type.NUMBER },
        tiktok: { type: Type.NUMBER },
      },
      required: ['twitter', 'facebook', 'tiktok'],
    },
    networkData: {
      type: Type.OBJECT,
      properties: {
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              group: { type: Type.STRING },
              influenceScore: { type: Type.NUMBER },
            },
            required: ['id', 'group', 'influenceScore'],
          },
        },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              target: { type: Type.STRING },
              value: { type: Type.NUMBER },
            },
            required: ['source', 'target', 'value'],
          },
        },
      },
      required: ['nodes', 'links'],
    },
  },
  required: ['summary', 'sentiment', 'keyNarratives', 'platformBreakdown', 'networkData'],
};


export const getDisinformationAnalysis = async (topic: string): Promise<AnalysisResult> => {
  const prompt = `
    You are an AI-powered Digital Disinformation Intelligence System named K-TRUTH. Your task is to analyze a given topic for potential online propaganda or fake news targeting Kenya.

    For the topic "${topic}", generate a simulated analysis. Monitor fictional activity on Twitter/X, TikTok, and Facebook.

    Provide the output as a valid JSON object that conforms to the provided schema.

    - All percentages in a group (sentiment, platformBreakdown, keyNarratives volume) must add up to 100.
    - Create a network of 15-25 nodes.
    - Node groups must be one of: 'Influencer', 'Bot', 'Media', 'Citizen'.
    - Links should connect the nodes logically to show information spread. Bot accounts should often be central spreaders.
    - The content must be plausible for a disinformation campaign related to the topic in Kenya.
    - Do not include any markdown formatting or any text outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (!result.summary || !result.networkData || !result.networkData.nodes) {
        throw new Error("Invalid data structure received from API.");
    }
    
    return result as AnalysisResult;
  } catch (error) {
    console.error("Error fetching or parsing Gemini response:", error);
    throw new Error("Failed to generate analysis. The model may have returned an invalid response.");
  }
};
