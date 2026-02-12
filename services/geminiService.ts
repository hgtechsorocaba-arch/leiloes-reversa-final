
import { GoogleGenAI, Type } from "@google/genai";
import { AISuggestion } from "../types";

const getAiInstance = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getAuctionSuggestion = async (userInput: string): Promise<AISuggestion | null> => {
  const ai = getAiInstance();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Você é o avaliador-chefe da Leilões Reversa. Sua tarefa é analisar a descrição de um lote de logística reversa e extrair/sugerir os campos necessários para o leilão.
      Descrição do usuário: "${userInput}"
      
      Regras de Negócio:
      1. Título: Deve ser chamativo e incluir a quantidade aproximada de itens.
      2. Preço Sugerido: Calcule um lance inicial de aproximadamente 30% a 40% do valor de mercado estimado de novos.
      3. Categoria: Escolha a que melhor se adapta.
      4. Condição: Avalie se é Open Box, No Estado ou Novo.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            suggestedDescription: { type: Type.STRING },
            estimatedMarketPrice: { type: Type.NUMBER },
            category: { type: Type.STRING },
            itemCount: { type: Type.INTEGER },
            origin: { type: Type.STRING },
            condition: { type: Type.STRING }
          },
          required: ["suggestedTitle", "suggestedDescription", "estimatedMarketPrice", "category", "itemCount", "origin", "condition"]
        }
      }
    });
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Erro no serviço Gemini:", error);
    return null;
  }
};

export const generateBannerImage = async (prompt: string): Promise<string | null> => {
  const ai = getAiInstance();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-quality photorealistic corporate banner for a logistics and auction website. Theme: ${prompt}. Professional lighting, 16:9 aspect ratio, clean design without text.` }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar imagem de banner:", error);
    return null;
  }
};

export const generateLogo = async (prompt: string): Promise<string | null> => {
  const ai = getAiInstance();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Modern minimalist vector logo for an auction brand named "Leilões Reversa". Abstract, corporate, professional, solid white background. Style: ${prompt}.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar logo:", error);
    return null;
  }
};
