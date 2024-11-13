import { prisma } from '../lib/prisma';

async function main() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database');

    // Create a test post
    const post = await prisma.blogPost.create({
      data: {
        title: 'Test Post',
        description: 'This is a test post to verify database connection',
      },
    });
    console.log('✅ Successfully created test post:', post);

    // Read the post back
    const readPost = await prisma.blogPost.findUnique({
      where: { id: post.id },
    });
    console.log('✅ Successfully read test post:', readPost);

    // Delete the test post
    await prisma.blogPost.delete({
      where: { id: post.id },
    });
    console.log('✅ Successfully deleted test post');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();