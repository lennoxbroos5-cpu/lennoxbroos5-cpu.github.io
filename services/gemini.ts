import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getChessAnalysis = async (fen: string, history: string[]): Promise<string> => {
  if (!aiClient) {
    return "Gemini API Key is missing. Please check your environment configuration.";
  }

  try {
    const prompt = `
      You are a Grandmaster Chess Coach.
      Analyze the following chess position (FEN): ${fen}
      Move history: ${history.slice(-5).join(', ')}...
      
      Provide a very brief, 2-sentence tip for the player whose turn it is. 
      Focus on threats or a good strategic plan. Do not be overly verbose.
    `;

    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I couldn't analyze the board at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "My connection to the chess server is weak (API Error).";
  }
};