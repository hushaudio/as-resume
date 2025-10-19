import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  post_type: string;
  status: string;
  youtube_video_id: string | null;
  youtube_channel_id: string | null;
  topic_id: string | null;
  word_count: number;
  reading_time_minutes: number | null;
  tags: string[];
  category: string | null;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  video_title?: string;
  video_url?: string;
  channel_handle?: string;
  channel_title?: string;
}

export interface YouTubeVideo {
  video_id: string;
  title: string | null;
  url: string | null;
  published_at: Date | null;
  channel_id: string | null;
}

export interface YouTubeChannel {
  channel_id: string;
  handle: string | null;
  title: string | null;
}

export async function getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
  const query = `
    SELECT 
      p.*,
      v.title as video_title,
      v.url as video_url,
      c.handle as channel_handle,
      c.title as channel_title
    FROM posts p
    LEFT JOIN youtube_videos v ON v.video_id = p.youtube_video_id
    LEFT JOIN youtube_channels c ON c.channel_id = p.youtube_channel_id
    WHERE p.post_type = 'blog'
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    SELECT 
      p.*,
      v.title as video_title,
      v.url as video_url,
      c.handle as channel_handle,
      c.title as channel_title
    FROM posts p
    LEFT JOIN youtube_videos v ON v.video_id = p.youtube_video_id
    LEFT JOIN youtube_channels c ON c.channel_id = p.youtube_channel_id
    WHERE p.slug = $1 AND p.post_type = 'blog'
  `;
  
  const result = await pool.query(query, [slug]);
  return result.rows[0] || null;
}

export async function getPostById(id: number): Promise<Post | null> {
  const query = `
    SELECT 
      p.*,
      v.title as video_title,
      v.url as video_url,
      c.handle as channel_handle,
      c.title as channel_title
    FROM posts p
    LEFT JOIN youtube_videos v ON v.video_id = p.youtube_video_id
    LEFT JOIN youtube_channels c ON c.channel_id = p.youtube_channel_id
    WHERE p.id = $1 AND p.post_type = 'blog'
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function getPublishedPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
  const query = `
    SELECT 
      p.*,
      v.title as video_title,
      v.url as video_url,
      c.handle as channel_handle,
      c.title as channel_title
    FROM posts p
    LEFT JOIN youtube_videos v ON v.video_id = p.youtube_video_id
    LEFT JOIN youtube_channels c ON c.channel_id = p.youtube_channel_id
    WHERE p.post_type = 'blog' AND p.status = 'published'
    ORDER BY p.published_at DESC, p.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
}

export async function getPostStats() {
  const query = `
    SELECT 
      COUNT(*) as total_posts,
      COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_posts,
      COUNT(CASE WHEN status = 'published' THEN 1 END) as published_posts,
      COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_posts,
      AVG(word_count) as avg_word_count,
      AVG(reading_time_minutes) as avg_reading_time
    FROM posts 
    WHERE post_type = 'blog'
  `;
  
  const result = await pool.query(query);
  return result.rows[0];
}

export async function searchPosts(searchTerm: string, limit: number = 10): Promise<Post[]> {
  const query = `
    SELECT 
      p.*,
      v.title as video_title,
      v.url as video_url,
      c.handle as channel_handle,
      c.title as channel_title
    FROM posts p
    LEFT JOIN youtube_videos v ON v.video_id = p.youtube_video_id
    LEFT JOIN youtube_channels c ON c.channel_id = p.youtube_channel_id
    WHERE p.post_type = 'blog' 
      AND p.status = 'published'
      AND (
        p.title ILIKE $1 
        OR p.content ILIKE $1 
        OR p.excerpt ILIKE $1
        OR $2 = ANY(p.tags)
      )
    ORDER BY p.published_at DESC, p.created_at DESC
    LIMIT $3
  `;
  
  const searchPattern = `%${searchTerm}%`;
  const result = await pool.query(query, [searchPattern, searchTerm, limit]);
  return result.rows;
}
