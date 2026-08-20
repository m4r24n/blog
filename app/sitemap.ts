import type { MetadataRoute } from 'next';
import { getAllPosts } from '../lib/posts';

const categories = ['journal', 'projects', 'photography', 'places', 'learning', 'work'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://blog.marzan.info';
  const staticPages = ['', '/categories', '/now', '/about', ...categories.map((category) => `/categories/${category}`)].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const posts = getAllPosts().map((post) => ({
    url: `${base}/posts/${post.slug}`,
    lastModified: new Date(`${post.date}T12:00:00Z`),
  }));

  return [...staticPages, ...posts];
}
