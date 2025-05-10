
import Link from 'next/link';
import Image from 'next/image';
import { mockBlogPosts, type BlogPost } from '@/data/blogPosts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = mockBlogPosts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto py-12 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary tracking-tight sm:text-5xl">
          Nosso Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Dicas, novidades e tudo sobre o universo dos importados.
        </p>
      </section>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground text-xl">Nenhum post encontrado ainda. Volte em breve!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                <a className="flex flex-col flex-grow">
                  {post.imageUrl && (
                    <CardHeader className="p-0">
                      <div className="aspect-video relative w-full bg-muted/10">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint="blog post image"
                        />
                      </div>
                    </CardHeader>
                  )}
                  <CardContent className="p-6 flex-grow">
                    <CardTitle className="text-xl font-semibold text-primary mb-2 group-hover:underline">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <CalendarDays size={14} className="mr-1.5" />
                      {new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {post.category && <span className="mx-1.5">•</span>}
                      {post.category && <span className="font-medium text-secondary">{post.category}</span>}
                    </div>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardContent>
                </a>
              </Link>
              <CardFooter className="p-6 pt-0 border-t mt-auto">
                <Link href={`/blog/${post.slug}`} passHref>
                  <Button variant="link" className="p-0 text-primary font-semibold">
                    Ler Mais <ArrowRight size={16} className="ml-1.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
