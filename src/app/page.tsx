import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            {post.ogImageUrl && (
              <div className="relative h-[300px] mb-4">
                <Image
                  src={post.ogImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}