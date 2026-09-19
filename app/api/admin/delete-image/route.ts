import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { deleteUrl, imageId } = await req.json();

    if (!deleteUrl && !imageId) {
      return NextResponse.json(
        { error: 'Missing deleteUrl or imageId.' },
        { status: 400 }
      );
    }

    // If a direct ImgBB delete URL is provided, call it server-side
    if (deleteUrl && typeof deleteUrl === 'string' && deleteUrl.startsWith('https://')) {
      try {
        await fetch(deleteUrl, { method: 'GET' });
      } catch (e) {
        console.warn('ImgBB remote deletion attempt:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image reference marked for removal successfully.',
      imageId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error occurred during image deletion.' },
      { status: 500 }
    );
  }
}
