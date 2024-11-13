import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true },
  });

  return posts.map((post) => ({
    id: post.id,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.ogImageUrl ? [post.ogImageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.ogImageUrl ? [post.ogImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const id = (await params).id;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to all posts
      </Link>

      <article className="prose prose-lg max-w-none">
        {post.ogImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.ogImageUrl}
            alt={post.title}
            className="w-full h-[300px] object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="mb-4">{post.title}</h1>
        <time className="text-sm text-gray-500 mb-8 block">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
      </article>
    </main>
  );
}