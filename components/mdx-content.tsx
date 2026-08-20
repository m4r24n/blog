import { MDXRemote } from 'next-mdx-remote-client/rsc';

const components = {
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel={props.href?.startsWith('http') ? 'noreferrer' : undefined} />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <figure><img {...props} loading="lazy" /><figcaption>{props.alt}</figcaption></figure>,
};

export default function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
