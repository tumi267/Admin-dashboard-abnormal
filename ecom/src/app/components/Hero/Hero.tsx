// app/components/hero.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddToCart from "../AddToCart/AddToCart";

interface HeroProps {
  title: string;
  msg: string;
  prodid: string;
}

export default function Hero({ msg, title,prodid }: HeroProps) {
  return (
    <section className="w-full bg-gray-100 h-[537px] py-20 px-4 text-left">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl p-10">
          <CardContent>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-lg text-gray-600 mb-6">{msg}</p>
            <AddToCart 
            prodid={prodid}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}