import { BlogPost } from '@prisma/client';

type BlogJsonLdProps = {
  post: BlogPost;
  baseUrl: string;
};

export function BlogJsonLd({ post, baseUrl }: BlogJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.ogImageUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.id}`,
    },
    author: {
      '@type': 'Person',
      name: 'Whadayanow',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OG Generation Experiment',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.jpg`, // Make sure to add your logo in public folder
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}