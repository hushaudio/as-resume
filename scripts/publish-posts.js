/**
 * Publish all draft blog posts
 */

import { getAllPosts, publishPost } from '../src/lib/admin.js';

async function publishAllDrafts() {
    console.log('📝 Publishing all draft blog posts...\n');

    try {
        const posts = await getAllPosts();
        const draftPosts = posts.filter(post => post.status === 'draft');

        console.log(`Found ${draftPosts.length} draft posts to publish:`);

        for (const post of draftPosts) {
            console.log(`  - ${post.title} (${post.slug})`);
        }

        if (draftPosts.length === 0) {
            console.log('No draft posts to publish.');
            return;
        }

        console.log('\nPublishing posts...');

        for (const post of draftPosts) {
            try {
                const result = await publishPost(post.id);
                console.log(`✅ Published: ${result.title}`);
            } catch (error) {
                console.error(`❌ Failed to publish ${post.title}:`, error.message);
            }
        }

        console.log(`\n✅ Successfully published ${draftPosts.length} posts!`);

    } catch (error) {
        console.error('❌ Error publishing posts:', error);
        process.exit(1);
    }
}

publishAllDrafts();