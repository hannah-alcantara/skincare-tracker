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
import { createClient } from "@/utils/supabase/client";

import {
  Home,
  Package,
  Calendar,
  Plus,
  AlignJustify,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { User } from "@supabase/supabase-js";

const navItems = [
  {
    href: "/dashboard",
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isLandingPage = pathname === "/";
  const showNavItems = user && !isAuthPage;

  return (
    <div>
      <NavigationMenu className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4'>
          {/* Mobile Nav */}
          <div className='flex justify-between items-center md:hidden h-16'>
            {showNavItems ? (
              <Sheet>
                <SheetTrigger>
                  <AlignJustify className='h-4 w-4 md:hidden' />
                </SheetTrigger>
                <SheetContent side='left'>
                  <SheetHeader>
                    <div className='flex flex-col gap-8'>
                      <div>
                        <Link
                          href='/dashboard'
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
                      <div className='flex items-center space-x-6'>
                        <LogOut className='h-4 w-4' />
                        <button
                          onClick={handleSignOut}
                          className='text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            ) : (
              <div />
            )}
            <div className='absolute left-1/2 -translate-x-1/2'>
              <Link
                href={user ? "/dashboard" : "/"}
                className='flex items-center space-x-2'
              >
                <span className='font-bold text-xl'>Skincare Tracker</span>
              </Link>
            </div>
            {showNavItems && (
              <div className='flex items-center gap-2'>
                <Button asChild size='sm' variant='secondary'>
                  <Link href='/products/add'>
                    <Plus />
                  </Link>
                </Button>
              </div>
            )}
            {!user && !isAuthPage && isLandingPage && (
              <div className='flex items-center gap-2'>
                <Button asChild size='sm' variant='secondary'>
                  <Link href='/sign-in'>Sign In</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <NavigationMenuList className='hidden md:flex items-center justify-between h-16'>
            <div className='flex items-center space-x-8'>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='hover:bg-transparent focus:bg-transparent'
                  asChild
                >
                  <Link
                    href={user ? "/dashboard" : "/"}
                    className='flex items-center space-x-2'
                  >
                    <Calendar className='h-6 w-6' />
                    <span className='font-bold text-xl'>Skincare Tracker</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {showNavItems && (
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
              )}
            </div>

            {showNavItems && (
              <div className='flex items-center gap-4'>
                <span className='text-sm text-muted-foreground'>
                  {user.email}
                </span>
                <NavigationMenuItem>
                  <NavigationMenuLink href='/products/add'>
                    <Button>
                      <Plus className='h-4 w-4 mr-2' />
                      Add Product
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <Button variant='ghost' size='sm' onClick={handleSignOut}>
                  <LogOut className='h-4 w-4' />
                </Button>
              </div>
            )}

            {!user && !isAuthPage && (
              <div className='flex items-center gap-2'>
                <Button asChild variant='ghost' size='sm'>
                  <Link href='/sign-in'>Sign In</Link>
                </Button>
                <Button asChild size='sm'>
                  <Link href='/sign-up'>Sign Up</Link>
                </Button>
              </div>
            )}
          </NavigationMenuList>
        </div>
      </NavigationMenu>
    </div>
  );
};
