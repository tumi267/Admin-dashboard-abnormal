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
        <Link
          key={product.id}
          href={`/category/${product.title.toLowerCase()}`}
          className="no-underline text-inherit"
        >
          <Card className="overflow-hidden">
            <CardHeader className="relative h-[368px] p-0">
              {/* Background image */}
              <Image
                src="/food.png"
                alt={product.title}
                fill
                className="object-cover z-0"
              />

              {/* Optional: gradient overlay for better readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

              {/* Title on top of image */}
              <CardTitle className="relative z-20 text-white text-2xl p-4">
                {product.title}
              </CardTitle>
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
