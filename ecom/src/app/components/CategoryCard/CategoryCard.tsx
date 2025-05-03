'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;

  description: string;
  image: string;
}

interface ProductGridProps {
  products: Product[];
}

function CaregoryCard({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-[2em]">
      {products.map((product) => (
        <Link key={product.id} href={`/category/${product.title.toLowerCase()}`} 
                 className="no-underline text-inherit"
        >
          <Card>
            <CardHeader className="relative h-[368px]">
            {/* Uncomment when image setup is ready */}
            {/* <Image
              src={product.image}
              alt={product.title}
              fill
            /> */}
            <CardTitle>{product.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-nowrap items-center justify-between gap-4">
              <CardDescription className="truncate max-w-[70%]">
                {product.description}
              </CardDescription>

            </div>
          </CardContent>
        </Card>
        </Link>
      ))}
    </div>
  );
}

export default CaregoryCard;