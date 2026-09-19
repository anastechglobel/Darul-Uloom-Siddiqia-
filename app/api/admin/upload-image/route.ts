import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.IMGBB_API_KEY || '01d35bbd85f1884c5c45de75bc879a38';

    // Read formData
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const base64Data = formData.get('base64') as string | null;

    if (!file && !base64Data) {
      return NextResponse.json(
        { error: 'No image file or image data provided.' },
        { status: 400 }
      );
    }

    // Check if ImgBB API key is configured
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'IMGBB_API_KEY is not configured on the server. Please add your ImgBB API key to environment variables, or enter a Direct Image URL.',
          needsApiKey: true,
        },
        { status: 503 }
      );
    }

    let payloadFormData = new FormData();

    if (file) {
      // Validate file type
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!validMimeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported image format (${file.type}). Allowed formats: JPEG, PNG, WEBP, GIF, SVG.` },
          { status: 400 }
        );
      }

      // Validate file size: maximum 10MB
      const maxSizeBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return NextResponse.json(
          { error: 'Image size exceeds maximum limit of 10 MB.' },
          { status: 400 }
        );
      }

      // Convert file buffer to base64 for ImgBB API stability
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = buffer.toString('base64');
      payloadFormData.append('image', base64String);
      if (file.name) {
        payloadFormData.append('name', file.name.replace(/\.[^/.]+$/, ''));
      }
    } else if (base64Data) {
      const cleaned = base64Data.replace(/^data:image\/\w+;base64,/, '');
      payloadFormData.append('image', cleaned);
    }

    // Call ImgBB API server-side
    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    const imgbbRes = await fetch(imgbbUrl, {
      method: 'POST',
      body: payloadFormData,
    });

    const responseData = await imgbbRes.json();

    if (!imgbbRes.ok || !responseData.success) {
      const errorMsg =
        responseData?.error?.message ||
        `ImgBB upload failed with status ${imgbbRes.status}`;
      return NextResponse.json({ error: errorMsg }, { status: 502 });
    }

    const data = responseData.data;

    // Return sanitized metadata to client
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        imageUrl: data.url,
        displayUrl: data.display_url,
        thumbnailUrl: data.thumb?.url || data.medium?.url || data.url,
        deleteUrl: data.delete_url,
        width: data.width,
        height: data.height,
        size: data.size,
        mime: data.image?.mime || 'image/jpeg',
        time: data.time,
      },
    });
  } catch (error: any) {
    console.error('Image upload server error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error occurred during image processing.' },
      { status: 500 }
    );
  }
}
