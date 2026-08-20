import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  readingTime: string;
};

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((name) => name.endsWith('.mdx')).map((name) => name.replace(/\.mdx$/, ''));
}

export function getPost(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const source = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(source);
  return {
    meta: {
      slug,
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      category: String(data.category ?? 'Journal'),
      excerpt: String(data.excerpt ?? ''),
      image: data.image ? String(data.image) : undefined,
      imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
      readingTime: readingTime(content),
    } satisfies PostMeta,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPost(slug)?.meta)
    .filter((post): post is PostMeta => Boolean(post))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00Z`));
}
