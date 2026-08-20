import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MdxContent from '../../../components/mdx-content';
import { formatPostDate, getPost, getPostSlugs } from '../../../lib/posts';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      title: post.meta.title,
      description: post.meta.excerpt,
      type: 'article',
      publishedTime: post.meta.date,
      images: post.meta.image ? [{ url: post.meta.image, alt: post.meta.imageAlt || post.meta.title }] : undefined,
    },
  };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return <article>
    <Link className="back-link" href="/">← All entries</Link>
    <div className="kicker">{post.meta.category} · {formatPostDate(post.meta.date)} · {post.meta.readingTime}</div>
    <h1 className="page-title">{post.meta.title}</h1>
    <p className="post-deck">{post.meta.excerpt}</p>
    {post.meta.image && <figure className="hero-image"><img src={post.meta.image} alt={post.meta.imageAlt || post.meta.title} /></figure>}
    <div className="prose"><MdxContent source={post.content} /></div>
  </article>;
}
