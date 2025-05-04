'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddToCart from "../AddToCart/AddToCart";
import Image from "next/image";

interface HeroProps {
  title: string;
  msg: string;
  product: string;
}

export default function Hero({ msg, title, product }: HeroProps) {

  const item = {
    id: product.id,
    title: product.title,
    price: product.price,
    qty: 1,
    sku: product.sku || 'n/a',
    image: product.image,
  };

  return (
    <section className="w-full h-[537px] py-20 px-4 text-left">
                {/* Background Image */}
                <Image
            src="/turntable.png"
            alt="Product image"
            fill
           
          />
      <div className="max-w-4xl mx-auto">
        <Card className="relative overflow-hidden h-[400px] border-none shadow-none bg-transparent">

          
          {/* Text Content */}
          <CardContent className="relative z-10 text-white p-10">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-200 mb-6">{msg}</p>
            <AddToCart item={item} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
