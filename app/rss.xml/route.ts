import { getAllPosts } from '../../lib/posts';

const base = 'https://blog.marzan.info';
const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[char] || char));

export async function GET() {
  const posts = getAllPosts();
  const items = posts.map((post) => `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${base}/posts/${post.slug}</link>\n      <guid>${base}/posts/${post.slug}</guid>\n      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>\n      <category>${escapeXml(post.category)}</category>\n      <description>${escapeXml(post.excerpt)}</description>\n    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Marzan — Notes &amp; Projects</title>\n    <link>${base}</link>\n    <description>A personal journal about projects, photographs, places and learning.</description>${items}\n  </channel>\n</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
