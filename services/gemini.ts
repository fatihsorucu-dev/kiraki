
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchMarketPulse() {
  try {
    const prompt = `Türkiye ekonomisi, TCMB faiz kararları, enflasyon ve USD/TRY, EUR/TRY kurları hakkındaki en son (bugünkü) gelişmeleri özetle. 
    Kısa, madde madde ve Türk KOBİ'leri için ne anlama geldiğini belirterek Türkçe yaz.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Piyasa bilgisi alınamadı.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Market Pulse Error:", error);
    return { text: "Piyasa verilerine şu an erişilemiyor.", sources: [] };
  }
}

export async function generateFinancialInsights(data: any) {
  try {
    const prompt = `
      Sen bir finansal zeka asistanısın. Aşağıdaki şirket finansal verilerini analiz et ve bir Türk KOBİ sahibi için 3 tane önemli, aksiyon alınabilir ve sade Türkçe ile ifade edilmiş öngörü (insight) üret.
      
      Veriler:
      - Mevcut Nakit: ${JSON.stringify(data.balances)}
      - Yaklaşan Faturalar: ${JSON.stringify(data.invoices)}
      - Çekler: ${JSON.stringify(data.checks)}
      - Döviz Kurları: ${JSON.stringify(data.fxRates)}
      
      Kurallar:
      - Muhasebe terimleri yerine sade bir dil kullan.
      - Her öngörü için bir aksiyon tipi belirle: 'pay_invoice', 'hedge_currency', 'view_forecast', 'update_balance', 'none'.
      - Çıktı formatı JSON olmalı.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
              actionType: { type: Type.STRING, enum: ['pay_invoice', 'hedge_currency', 'view_forecast', 'update_balance', 'none'] },
              actionTarget: { type: Type.STRING }
            },
            required: ['id', 'title', 'content', 'severity', 'actionType']
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function chatWithKuraki(message: string, context: any) {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are KURAKI, a financial intelligence AI for Turkish SMEs.
      You have access to:
      - Balances: ${JSON.stringify(context.balances)}
      - Invoices: ${JSON.stringify(context.invoices)}
      - Checks: ${JSON.stringify(context.checks)}
      - Current FX: ${JSON.stringify(context.fxRates)}
      Rules:
      1. Always speak Turkish.
      2. Be concise.
      3. Focus on cashflow impact including check maturities.`
    },
  });

  const result = await chat.sendMessage({ message });
  return result.text;
}

export async function scanInvoiceImage(base64Data: string) {
  const prompt = "Extract invoice data: counterparty, amount, currency, dueDate, type. Return JSON.";
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          counterparty: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          dueDate: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['payable', 'receivable'] }
        },
        required: ['counterparty', 'amount', 'currency', 'dueDate', 'type']
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function getPaymentStrategy(invoices: any[], balances: any) {
  const prompt = `Analyze invoices and suggest 3 payment strategies in Turkish. JSON array.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
}
