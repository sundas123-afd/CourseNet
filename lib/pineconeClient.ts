import { Pinecone } from "@pinecone-database/pinecone";

let indexInstance: any = null;

export const getPineconeIndex = () => {
  if (indexInstance) return indexInstance;

  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error("Pinecone API key not found. Please add PINECONE_API_KEY to your environment variables.");
  }

  const pinecone = new Pinecone({
    apiKey,
  });

  indexInstance = pinecone.Index("coursenet");
  return indexInstance;
};
