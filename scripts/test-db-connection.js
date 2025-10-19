#!/usr/bin/env node

import { getPublishedPosts } from './src/lib/db.js';

async function testConnection() {
    try {
        console.log('Testing database connection...');
        const posts = await getPublishedPosts(5, 0);
        console.log(`✅ Found ${posts.length} published posts:`);
        posts.forEach(post => console.log(`- ${post.title} (${post.status})`));
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

