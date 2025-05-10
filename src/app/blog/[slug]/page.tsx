
import { mockBlogPosts, type BlogPost } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, UserCircle, Tag, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = mockBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Link href="/blog" passHref>
        <Button variant="outline" className="mb-8">
          <ArrowLeft size={18} className="mr-2" /> Voltar para o Blog
        </Button>
      </Link>

      <article className="bg-card p-6 sm:p-8 rounded-lg shadow-xl">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-3 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-1">
            <div className="flex items-center">
              <CalendarDays size={16} className="mr-1.5" />
              {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center">
              <UserCircle size={16} className="mr-1.5" />
              {post.author}
            </div>
            {post.category && (
              <div className="flex items-center">
                <Tag size={16} className="mr-1.5" />
                <Badge variant="secondary">{post.category}</Badge>
              </div>
            )}
          </div>
        </header>

        {post.imageUrl && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 shadow-md">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="blog hero image"
            />
          </div>
        )}
        
        {/* Basic Markdown-like rendering for \\n as <br /> and ## as <h2> */}
        <div 
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-foreground"
          dangerouslySetInnerHTML={{ 
            __html: post.content
              .split('\n')
              .map(line => {
                if (line.startsWith('## ')) {
                  return `<h2 class="text-2xl font-semibold mt-6 mb-3 text-secondary">${line.substring(3)}</h2>`;
                }
                if (line.startsWith('*   ')) {
                    return `<li class="ml-4 list-disc">${line.substring(4)}</li>`;
                }
                if (line.trim() === '') {
                    return '<br />';
                }
                return `<p class="mb-4 leading-relaxed">${line}</p>`;
              })
              .join('') 
          }} 
        />


        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-md font-semibold text-muted-foreground mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

// Add metadata generation if needed
// export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
//   const post = mockBlogPosts.find((p) => p.slug === params.slug);
//   if (!post) return { title: "Post Não Encontrado" };
//   return {
//     title: `${post.title} | Blog ${STORE_NAME}`,
//     description: post.excerpt,
//     openGraph: {
//       title: post.title,
//       description: post.excerpt,
//       type: 'article',
//       publishedTime: post.date,
//       authors: [post.author],
//       images: post.imageUrl ? [{ url: post.imageUrl }] : [],
//     },
//   };
// }
