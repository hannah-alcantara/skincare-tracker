"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { Home, Package, Calendar, Plus, AlignJustify } from "lucide-react";
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
    <div>
      <NavigationMenu className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4'>
          {/* Mobile Nav */}
          <div className='flex justify-between items-center md:hidden h-16'>
            <Sheet>
              <SheetTrigger>
                <AlignJustify className='h-4 w-4 md:hidden' />
              </SheetTrigger>
              <SheetContent side='left'>
                <SheetHeader>
                  <div className='flex flex-col gap-8'>
                    <div>
                      <Link
                        href='/products'
                        className='flex flex-row items-center space-x-6'
                      >
                        <Calendar className='h-6 w-6' />
                        <span className='font-bold text-xl'>
                          Skincare Tracker
                        </span>
                      </Link>
                    </div>
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.href}
                          className='flex items-center space-x-6'
                        >
                          <Icon className='h-4 w-4' />
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                              pathname === item.href
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.label}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <div className='absolute left-1/2 -translate-x-1/2'>
              <Link href='/' className='flex items-center space-x-2'>
                <span className='font-bold text-xl'>Skincare Tracker</span>
              </Link>
            </div>
            <div>
              <Button asChild size='sm' variant='secondary'>
                <Link href='/products/add'>
                  <Plus />
                </Link>
              </Button>
            </div>
          </div>

          {/* Desktop Nav */}
          <NavigationMenuList className='hidden md:flex items-center justify-between h-16'>
            <div className='flex items-center space-x-8'>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='	hover:bg-transparent focus:bg-transparent'
                  asChild
                >
                  <Link href='/' className='flex items-center space-x-2'>
                    <Calendar className='h-6 w-6' />
                    <span className='font-bold text-xl'>Skincare Tracker</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className='flex items-center space-x-6'>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuLink asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        <Icon className='h-4 w-4' />
                        <span>{item.label}</span>
                      </Link>
                    </NavigationMenuLink>
                  );
                })}
              </NavigationMenuItem>
            </div>

            <NavigationMenuItem>
              <NavigationMenuLink href='/products/add'>
                <Button >
                  <Plus className='h-4 w-4 mr-2' />
                  Add Product
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </NavigationMenu>
    </div>
  );
};
