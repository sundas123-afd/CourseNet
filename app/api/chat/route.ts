import * as fs from 'fs';
import * as path from 'path';
import Groq from 'groq-sdk';

export const loadKnowledgeBase = async (): Promise<string> => {
  const filePath = path.join(process.cwd(), 'data', 'knowledge-base.txt');
  const text = fs.readFileSync(filePath, 'utf-8');
  return text;
};

export async function queryLLM(
  question: string,
): Promise<{result: string, sources: any[]}> {
  try {
    // Load knowledge base
    const knowledgeBaseText = await loadKnowledgeBase();
    
    console.log('Querying Groq with knowledge base for question:', question);
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const prompt = `You are an AI assistant for the CourseNet platform. Follow these rules strictly:
1. If user asks about greetngs, respond with a friendly greeting.
2. First check if the answer exists in the knowledge base below
3. If answer is in knowledge base: Start with "According to my knowledge base:" then give a slightly detailed but concise answer
4. If answer is NOT in knowledge base: Start with "According to my general knowledge:" then give a slightly detailed but concise answer
5. Keep responses moderately short and detailed.
6. No extra explanations about what's in or not in knowledge base
7. Provide helpful context but keep it focused

Knowledge Base:
"""
${knowledgeBaseText}
"""

Question: ${question}

Respond following the rules above.`;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
    
    const text = chatCompletion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    
    console.log('Groq Response received');
    
    return {
      result: text,
      sources: [],
    };
  } catch (error: any) {
    console.error('Error with Groq:', error);
    
    // Check if it's a quota exceeded error
    if (error.message.includes('quota') || error.message.includes('429')) {
      return {
        result: "According to my general knowledge: I've reached my daily limit for AI responses. Please try again tomorrow!",
        sources: [],
      };
    }
    
    // Check if it's a network error
    if (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND')) {
      return {
        result: "According to my general knowledge: I'm having connection issues. Please try again later.",
        sources: [],
      };
    }
    
    // Fallback response
    return {
      result: "According to my general knowledge: I'm experiencing technical difficulties. Please try again later.",
      sources: [],
    };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid messages format", { status: 400 });
    }

    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    
    if (!lastUserMessage.content) {
      return new Response("No content in message", { status: 400 });
    }

    // Query the LLM
    const response = await queryLLM(lastUserMessage.content);

    return new Response(JSON.stringify({
      role: "assistant",
      content: response.result
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return new Response(`Internal Server Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
}