import { createOpenAIEmbedding } from '@/lib/ai-service';
import { chunkFile } from '@/lib/preparation';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const prisma = new PrismaClient();

const UploadSchema = z.object({
  content: z.string(),
  openaiApiKey: z.string(),
});

export async function PUT(request: NextRequest) {
  try {
    const { content, openaiApiKey } = UploadSchema.parse(await request.json());

    if (content.length > 20000) {
      return NextResponse.json(
        { error: 'File content must be under 20,000 characters' },
        { status: 400 },
      );
    }

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 },
      );
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // First chunk the content into smaller parts
    const chunks = chunkFile(content);

    // Then create embeddings for each chunk
    const embeddings = await Promise.all(
      chunks
        .filter((chunk) => chunk.length > 0)
        .map((chunk) => createOpenAIEmbedding(openai, chunk)),
    );

    // Finally, create source chunks in the database
    const createdSourceChunks = chunks.map((chunk, index) => {
      return {
        content: chunk,
        vectorizedContent: embeddings[index],
      };
    });
    await Promise.all(
      createdSourceChunks.map(async (sourceChunk) => {
        return prisma.sourceChunk.create({
          data: {
            content: sourceChunk.content,
            vectorizedContent: sourceChunk.vectorizedContent,
          },
        });
      }),
    );

    return NextResponse.json({
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'An error occurred while uploading the file' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({});
}
