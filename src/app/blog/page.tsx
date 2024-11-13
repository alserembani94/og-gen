import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Read our latest blog posts',
  openGraph: {
    title: 'Blog Posts',
    description: 'Read our latest blog posts',
    type: 'website',
  },
};

// Set revalidation time
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      ogImageUrl: true,
    },
  });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link 
            key={post.id}
            href={`/blog/${post.id}`}
            className="block group"
          >
            <article className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              {post.ogImageUrl && (
                <div className="relative h-[200px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.ogImageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <time className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </article>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No posts available yet.
          </div>
        )}
      </div>
    </main>
  );
}