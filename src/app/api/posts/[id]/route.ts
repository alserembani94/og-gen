import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { r2Client } from '@/lib/r2';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: Request,
  // { params }: { params: { id: string } }
) {
  try {
    const params: { id: string } = await request.json();
    // Get the post first to get the OG image key
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      select: { ogImageKey: true }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete the OG image from R2 if it exists
    if (post.ogImageKey) {
      try {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
            Key: post.ogImageKey,
          })
        );
      } catch (error) {
        console.error('Error deleting OG image:', error);
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete the post
    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    revalidatePath('/blog');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Error deleting post' },
      { status: 500 }
    );
  }
}