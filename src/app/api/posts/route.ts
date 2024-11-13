import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOGImage } from '@/lib/og-image';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = postSchema.parse(json);

    const { url: ogImageUrl, key: ogImageKey } = await generateOGImage(body.title, body.description);
    
    const post = await prisma.blogPost.create({
      data: {
        ...body,
        ogImageUrl,
        ogImageKey,
      },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.id}`);

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json();
    const { id, ...updateData } = json;
    const body = postSchema.parse(updateData);

    // Get the existing post to access its OG image key
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { ogImageKey: true }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Generate new OG image using the existing key
    const { url: ogImageUrl } = await generateOGImage(
      body.title, 
      body.description, 
      existingPost.ogImageKey ?? undefined
    );

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...body,
        ogImageUrl,
      },
    });


    revalidatePath('/blog');
    revalidatePath(`/blog/${post.id}`);
    
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
  }
}

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(posts);
}