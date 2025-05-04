'use client'

import Link from "next/link"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import NavSearch from "./NavSearch/NavSearch"
import { useEffect, useState } from "react"
import NavCartModule from "./NavCartModule/NavCartModule"
import { useGlobalContext } from "@/app/context/store"

export default function Navbar() {
  const [carthover, setCartHover] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [totalQty,setTotalQty]=useState(0)
  // 🛒 Get cart data from context
  const { data } = useGlobalContext()

  
  useEffect(()=>{
    let total = data.reduce((sum, item) => sum + item.qty, 0)
    setTotalQty(total)
  },[data])
  const cartCount = totalQty;
  const categories = [
    'fruit', 'veg', 'meat', 'dairy', 'bakery', 'seafood',
    'beverages', 'snacks', 'grains', 'spices', 'frozen foods',
    'canned goods', 'condiments', 'sauces', 'pasta',
    'breakfast foods', 'desserts', 'nuts', 'seeds',
    'oils', 'herbs', 'baby food', 'pet food'
  ];

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={cn(
        "sticky flex items-center justify-between p-4 shadow-md pr-[2em] pl-[2em] w-full top-0 left-0 bg-white z-[999] transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link href="/">Logo</Link>
      </div>

      {/* Nav Search */}
      <NavSearch />

      {/* Navigation Menu */}
      <NavigationMenu className="relative z-[10]">
        <NavigationMenuList className="flex gap-6">
          
          {/* Home */}
          <NavigationMenuItem>
            <Link href="/" passHref legacyBehavior>
              <NavigationMenuLink className="text-base font-medium">
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          {/* Category */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-base font-medium">
              <Link href="/category">Category</Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-wrap gap-2 p-4 bg-white shadow-md rounded-md">
              {categories.map((category) => (
                <Link key={category} href={`/category/${category}`} passHref legacyBehavior>
                  <NavigationMenuLink className="p-2 hover:underline capitalize">
                    {category}
                  </NavigationMenuLink>
                </Link>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Cart */}
          <NavigationMenuItem>
            <Link href="/cart" passHref legacyBehavior>
              <NavigationMenuLink className="text-base font-medium">
                Cart
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        </NavigationMenuList>

        {/* Cart Icon */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart
                onMouseOver={() => setCartHover(true)}
                onMouseLeave={() => setCartHover(false)}
                className="w-6 h-6"
              />
            </Link>
          </Button>
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 text-xs px-1">
              {cartCount}
            </Badge>
          )}
          {carthover && <NavCartModule />}
        </div>
      </NavigationMenu>
    </nav>
  );
}
