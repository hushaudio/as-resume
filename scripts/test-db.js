/**
 * Test database connection and blog posts
 */

import { getPublishedPosts, getPostStats } from '../src/lib/db.js';

async function testDatabase() {
    console.log('🔍 Testing database connection...\n');

    try {
        // Test post stats
        console.log('📊 Blog Post Statistics:');
        const stats = await getPostStats();
        console.log(`  Total posts: ${stats.total_posts}`);
        console.log(`  Draft posts: ${stats.draft_posts}`);
        console.log(`  Published posts: ${stats.published_posts}`);
        console.log(`  Archived posts: ${stats.archived_posts}`);
        console.log(`  Average word count: ${Math.round(parseFloat(stats.avg_word_count || '0'))}`);
        console.log(`  Average reading time: ${Math.round(parseFloat(stats.avg_reading_time || '0'))} minutes\n`);

        // Test getting published posts
        console.log('📝 Published Blog Posts:');
        const posts = await getPublishedPosts(5);

        if (posts.length === 0) {
            console.log('  No published posts found.');
        } else {
            posts.forEach((post, index) => {
                console.log(`  ${index + 1}. ${post.title}`);
                console.log(`     Slug: ${post.slug}`);
                console.log(`     Status: ${post.status}`);
                console.log(`     Words: ${post.word_count}`);
                console.log(`     Reading time: ${post.reading_time_minutes} min`);
                console.log(`     Channel: ${post.channel_handle || 'N/A'}`);
                console.log(`     Video: ${post.video_title || 'N/A'}`);
                console.log(`     Created: ${post.created_at.toISOString().split('T')[0]}`);
                console.log('');
            });
        }

        console.log('✅ Database connection successful!');

    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

testDatabase();