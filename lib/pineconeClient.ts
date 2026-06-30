import { Pinecone } from "@pinecone-database/pinecone";

// Retrieve API Key and Environment from environment variables
const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("Pinecone API key not found");
}

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey,
});

// Initialize and export the Pinecone index
export const index = pinecone.Index("coursenet");
