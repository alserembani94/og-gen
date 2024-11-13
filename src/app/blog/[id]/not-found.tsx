import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
      <p className="text-gray-600 mb-6">
        The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/blog"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Back to all posts
      </Link>
    </div>
  );
}