import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function publishPost(id: number) {
  const query = `
    UPDATE posts 
    SET status = 'published', published_at = NOW(), updated_at = NOW()
    WHERE id = $1 AND post_type = 'blog'
    RETURNING id, title, slug, status, published_at
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function unpublishPost(id: number) {
  const query = `
    UPDATE posts 
    SET status = 'draft', published_at = NULL, updated_at = NOW()
    WHERE id = $1 AND post_type = 'blog'
    RETURNING id, title, slug, status
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

export async function getAllPosts(limit: number = 50, offset: number = 0) {
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
