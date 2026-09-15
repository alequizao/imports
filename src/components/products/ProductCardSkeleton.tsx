/*
 * Imports · Desenvolvido por Alequizao <alequizao.dev@gmail.com>
 * https://github.com/alequizao · © 2026 Alequizao. Todos os direitos reservados.
 */

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg">
      <CardHeader className="p-0">
        <Skeleton className="aspect-[4/3] w-full bg-muted/20" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" /> {/* Title skeleton */}
        <Skeleton className="h-4 w-full mb-1 rounded" /> {/* Description line 1 skeleton */}
        <Skeleton className="h-4 w-5/6 mb-3 rounded" /> {/* Description line 2 skeleton */}
        <Skeleton className="h-7 w-1/2 rounded" /> {/* Price skeleton */}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Skeleton className="h-10 w-full rounded-md" /> {/* Button skeleton */}
      </CardFooter>
    </Card>
  );
}
