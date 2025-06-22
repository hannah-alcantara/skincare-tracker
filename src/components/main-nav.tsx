"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { Home, Package, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/products",
    label: "Products",
    icon: Package,
  },
];

export const MainNav = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu className='flex h-16'>
      <div className='flex justify-between container mx-auto px-4 bg-blue-400 border-b'>
        <NavigationMenuList className='flex items-center space-x-8'>
          {/* Name */}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/products'>
                <Calendar className='h-6 w-6' />
                <span className='font-bold text-xl'>Skincare Tracker</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* Menus */}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavigationMenuItem
                key={item.href}
                className='flex items-center space-x-6'
              >
                <Icon className='h-4 w-4' />
                <NavigationMenuLink
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}

          {/* Button */}
          <NavigationMenuItem>
            <Button asChild>
              <Link href='/'>
                <Plus className='h-4 w-4 mr-1' />
                Add Product
              </Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
};
