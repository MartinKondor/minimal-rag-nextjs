import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UploadSchema = z.object({
  content: z.string(),
});

export async function PUT(request: NextRequest) {
  try {
    const { content } = UploadSchema.parse(await request.json());

    if (content.length > 20000) {
      return NextResponse.json(
        { error: 'File content must be under 20,000 characters' },
        { status: 400 },
      );
    }

    // TOOD: Implement file upload logic

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
