/**
 * Test markdown rendering with a sample blog post
 */

import { getPostBySlug } from '../src/lib/db.js';

async function testMarkdownRendering() {
    console.log('🧪 Testing markdown rendering...\n');

    try {
        // Get a sample blog post
        const post = await getPostBySlug('vo-31-designing-a-creative-ai-studio-for-the-next-wave-of-visual-storytelling');

        if (!post) {
            console.log('No blog post found with that slug');
            return;
        }

        console.log(`📝 Blog Post: ${post.title}`);
        console.log(`📊 Word Count: ${post.word_count}`);
        console.log(`⏱️  Reading Time: ${post.reading_time_minutes} minutes`);
        console.log(`📅 Created: ${post.created_at}`);
        console.log(`\n📄 Content Preview (first 500 characters):`);
        console.log('='.repeat(60));
        console.log(post.content.substring(0, 500));
        console.log('='.repeat(60));

        // Check if content contains markdown syntax
        const hasMarkdown = /[#*`\[\]()]/.test(post.content);
        console.log(`\n🔍 Contains Markdown Syntax: ${hasMarkdown ? 'Yes' : 'No'}`);

        if (hasMarkdown) {
            console.log('✅ Content appears to contain markdown formatting');
            console.log('   The MarkdownRenderer component should properly render this content');
        } else {
            console.log('ℹ️  Content appears to be plain text');
            console.log('   The MarkdownRenderer will still work but may not show much formatting');
        }

        console.log('\n✅ Markdown rendering test completed');

    } catch (error) {
        console.error('❌ Error testing markdown rendering:', error);
        process.exit(1);
    }
}

