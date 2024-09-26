import { SearchResult } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SearchSchema = z.object({
  query: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { query } = SearchSchema.parse(await request.json());

    // TODO: Implement search logic
    const searchResults = [
      {
        content: query,
        score: 1,
      },
      {
        content: query,
        score: 0.5,
      },
    ] as SearchResult[];

    return NextResponse.json({ searchResults });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({});
}
