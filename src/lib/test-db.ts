import { prisma } from './prisma';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database');
    
    // Test query
    const count = await prisma.blogPost.count();
    console.log(`Current number of posts: ${count}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}
testConnection();