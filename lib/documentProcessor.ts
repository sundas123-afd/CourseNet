import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI, GenerativeModel, ContentEmbedding } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

let pineconeInstance: Pinecone | null = null;
let genAIInstance: GoogleGenerativeAI | null = null;
let modelInstance: GenerativeModel | null = null;

function getPinecone() {
  if (pineconeInstance) return pineconeInstance;
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error("Pinecone API key not found. Please set PINECONE_API_KEY.");
  }
  pineconeInstance = new Pinecone({ apiKey });
  return pineconeInstance;
}

function getModel() {
  if (modelInstance) return modelInstance;
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Google Generative AI API key not found. Please set GOOGLE_GENERATIVE_AI_API_KEY.");
  }
  genAIInstance = new GoogleGenerativeAI(apiKey);
  modelInstance = genAIInstance.getGenerativeModel({ model: "gemini-pro-1.5" });
  return modelInstance;
}

async function embedText(text: string): Promise<number[]> {
  const model = getModel();
  const result = await model.embedContent(text);
  if (!result.embedding) {
    throw new Error("Failed to generate embedding");
  }
  return convertContentEmbeddingToArray(result.embedding);
}

function convertContentEmbeddingToArray(embedding: ContentEmbedding): number[] {
  if (Array.isArray(embedding)) {
    return embedding;
  } else if (embedding instanceof Float32Array || embedding instanceof Float64Array) {
    return Array.from(embedding);
  } else if (typeof embedding === 'object' && embedding !== null) {
    return Object.values(embedding).filter(value => typeof value === 'number');
  } else {
    throw new Error("Unsupported embedding format");
  }
}

export async function processDocument(text: string, metadata: Record<string, any> = {}) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await textSplitter.createDocuments([text], [metadata]);
  const index = getPinecone().Index(process.env.PINECONE_INDEX_NAME!);

  for (const doc of docs) {
    const embedding = await embedText(doc.pageContent);
    await index.upsert([{
      id: doc.metadata.id || Date.now().toString(),
      values: embedding,
      metadata: { ...doc.metadata, content: doc.pageContent }
    }]);
  }

  console.log("Document processed and stored in Pinecone");
}

export async function queryPinecone(query: string) {
  const index = getPinecone().Index(process.env.PINECONE_INDEX_NAME!);
  const queryEmbedding = await embedText(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true
  });

  return results.matches.map(match => match.metadata?.content as string).filter(Boolean);
}

export async function generateResponse(query: string, context: string[]) {
  const model = getModel();
  const prompt = `
    Context: ${context.join('\n\n')}
    
    Human: ${query}
    
    Assistant: Based on the context provided, I'll do my best to answer the question. If I'm not sure or the information isn't in the context, I'll say so.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}