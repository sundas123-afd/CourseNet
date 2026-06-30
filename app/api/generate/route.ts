import { NextResponse } from 'next/server';
import { index } from '@/lib/pineconeClient';
import { generateEmbedding } from '@/lib/emdeddings';

export async function POST(req: Request) {
  try {
    const { title, text } = await req.json();

    // Generate embedding for the text
    const embedding = await generateEmbedding(text);

    // Upsert the document to Pinecone
    await index.upsert([
      {
        id: title,
        values: embedding,
        metadata: { title, content: text }
      }
    ]);

    return NextResponse.json({ success: true, message: 'Document upserted successfully' });
  } catch (error) {
    console.error('Error upserting document:', error);
    return NextResponse.json({ success: false, error: 'Failed to upsert document' }, { status: 500 });
  }
}