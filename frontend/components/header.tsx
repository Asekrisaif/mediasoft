"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Search as SearchIcon,
  ChevronDown,
  Zap,
  Bell,
  Heart,
  LayoutDashboard,
  ShoppingBag,
  Gift,
  MessageSquare,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store";
import { useCartStore } from "@/lib/store";
import { Search } from "@/components/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import OverlayMenu from "./OverlayMenu";
import {useRouter} from "next/navigation"; // Import the new overlay menu component

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const { setTheme, theme } = useTheme();
  const { items } = useCartStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  // We'll add a state for orders count - this would typically come from an API

  const cartItemsCount = items.reduce(
      (total, item) => total + item.quantity,
      0,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate fetching orders count when user is authenticated
  const ordersCount = user?.ordersCount || 0;

  // Prevent body scroll when menu is open but still allow seeing background
  useEffect(() => {
    if (isMenuOpen) {
      // Allow scrolling the menu itself but not the body
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const categories = [
    {
      title: "Gaming",
      description: "High-performance gaming equipment",
      items: [
        {
          title: "Gaming PCs",
          href: "/category/gaming-pcs",
          description: "Custom-built gaming rigs",
        },
        {
          title: "Gaming Laptops",
          href: "/category/gaming-laptops",
          description: "Portable gaming power",
        },
        {
          title: "Consoles",
          href: "/category/consoles",
          description: "Next-gen gaming consoles",
        },
        {
          title: "Controllers",
          href: "/category/controllers",
          description: "Precision gaming controls",
        },
      ],
    },
    {
      title: "Components",
      description: "Premium PC components",
      items: [
        {
          title: "GPUs",
          href: "/category/gpus",
          description: "High-end graphics cards",
        },
        {
          title: "CPUs",
          href: "/category/cpus",
          description: "Powerful processors",
        },
        {
          title: "Memory",
          href: "/category/memory",
          description: "Ultra-fast RAM",
        },
        {
          title: "Storage",
          href: "/category/storage",
          description: "SSDs and HDDs",
        },
      ],
    },
    {
      title: "Peripherals",
      description: "Essential accessories",
      items: [
        {
          title: "Monitors",
          href: "/category/monitors",
          description: "Professional displays",
        },
        {
          title: "Keyboards",
          href: "/category/keyboards",
          description: "Mechanical keyboards",
        },
        {
          title: "Mice",
          href: "/category/mice",
          description: "Precision gaming mice",
        },
        {
          title: "Headsets",
          href: "/category/headsets",
          description: "Immersive audio",
        },
      ],
    },
  ];

  // Helper function to get initials from user name
  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.prenom?.charAt(0) || ""}${user.nom?.charAt(0) || ""}`;
  };

  return (
      <header
          className={cn(
              "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
              isScrolled
                  ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
                  : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm",
          )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <Link href="/" className="z-10 flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur" />
                <div className="relative rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-1.5">
                  <Zap className="size-5 text-white" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              TechVerse
            </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-1 lg:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink
                          className={cn(
                              navigationMenuTriggerStyle(),
                              "bg-transparent hover:bg-white/10",
                              isScrolled ? "text-foreground" : "text-white",
                          )}
                      >
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                        className={cn(
                            "bg-transparent hover:bg-white/10",
                            isScrolled ? "text-foreground" : "text-white",
                        )}
                    >
                      Shop
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[800px] grid-cols-3 gap-4 p-6">
                        {categories.map((category) => (
                            <div key={category.title} className="space-y-4">
                              <div className="text-lg font-medium">
                                {category.title}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {category.description}
                              </p>
                              <div className="space-y-2">
                                {category.items.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="block rounded-lg p-3 transition-colors hover:bg-muted"
                                    >
                                      <div className="font-medium">{item.title}</div>
                                      <p className="text-sm text-muted-foreground">
                                        {item.description}
                                      </p>
                                    </Link>
                                ))}
                              </div>
                            </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/store" legacyBehavior passHref>
                      <NavigationMenuLink
                          className={cn(
                              navigationMenuTriggerStyle(),
                              "bg-transparent hover:bg-white/10",
                              isScrolled ? "text-foreground" : "text-white",
                          )}
                      >
                        All Products
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about" legacyBehavior passHref>
                      <NavigationMenuLink
                          className={cn(
                              navigationMenuTriggerStyle(),
                              "bg-transparent hover:bg-white/10",
                              isScrolled ? "text-foreground" : "text-white",
                          )}
                      >
                        About Us
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden items-center space-x-2 md:flex">
                <Search />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "relative hover:bg-white/10",
                            isScrolled ? "text-foreground" : "text-white",
                        )}
                    >
                      <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative hover:bg-white/10",
                        isScrolled ? "text-foreground" : "text-white",
                    )}
                >
                  <Heart className="size-5" />
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  2
                </span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "relative hover:bg-white/10",
                        isScrolled ? "text-foreground" : "text-white",
                    )}
                >
                  <Bell className="size-5" />
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  3
                </span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "relative rounded-full overflow-hidden hover:bg-white/10",
                            isScrolled ? "text-foreground" : "text-white",
                        )}
                    >
                      {isAuthenticated ? (
                          <div className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                        <span className="text-xs font-semibold text-white">
                          {getUserInitials()}
                        </span>
                          </div>
                      ) : (
                          <UserCircle className="size-5" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                      align="end"
                      side="bottom"
                      alignOffset={-5}
                      sideOffset={8}
                      className="w-80 p-4"
                  >
                    {isAuthenticated && user ? (
                        <>
                          <div className="flex items-center gap-4 border-b pb-4">
                            <div className="relative size-12 rounded-full overflow-hidden">
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                            <span className="text-lg font-semibold text-white">
                              {getUserInitials()}
                            </span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white bg-green-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {user.prenom} {user.nom}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              {/* Changed from Location to Orders */}
                              <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-sm font-medium">Orders</p>
                                <p className="text-lg font-bold">
                                  {ordersCount}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Purchases made
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-sm font-medium">Points</p>
                                <p className="text-2xl font-bold">
                                  {user.soldePoints || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ≈ ${((user.soldePoints || 0) * 0.01).toFixed(2)} value
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <DropdownMenuItem asChild>
                                <Link
                                    href="/profile/dashboard"
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                  <LayoutDashboard className="size-4" />
                                  <span>Dashboard</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                    href="/profile/orders"
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                  <ShoppingBag className="size-4" />
                                  <span>Orders</span>
                                  {ordersCount > 0 && (
                                      <Badge variant="secondary" className="ml-auto">
                                        {ordersCount}
                                      </Badge>
                                  )}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                    href="/profile/points"
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                  <Gift className="size-4" />
                                  <span>Points & Rewards</span>
                                  {(user.soldePoints || 0) > 0 && (
                                      <Badge variant="secondary" className="ml-auto">
                                        {user.soldePoints || 0}
                                      </Badge>
                                  )}
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                    href="/profile/messages"
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                  <MessageSquare className="size-4" />
                                  <span>Messages</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                    href="/profile/settings"
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                  <Settings className="size-4" />
                                  <span>Settings</span>
                                </Link>
                              </DropdownMenuItem>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                                onClick={() => {
                                  logout();
                                  router.push('/auth/signin');
                                }}
                            >
                              <LogOut className="mr-2 size-4" />
                              Sign Out
                            </Button>
                          </div>
                        </>
                    ) : (
                        <>
                          <div className="mb-3 border-b pb-3">
                            <div className="mb-3 flex items-center justify-center">
                              <div className="relative">
                                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur" />
                                <div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                                  <UserCircle className="size-7 text-white" />
                                </div>
                              </div>
                            </div>
                            <h3 className="text-center text-lg font-semibold">
                              Hello, Guest
                            </h3>
                            <p className="mt-1 text-center text-sm text-muted-foreground">
                              Sign in to access your account
                            </p>
                          </div>

                          <div className="space-y-3">
                            <Button
                                variant="default"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:opacity-90"
                                asChild
                            >
                              <Link
                                  href="/auth/signin"
                                  className="flex items-center justify-center gap-2"
                              >
                                <User className="size-4" />
                                Sign In
                              </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full border-blue-600/30 shadow-sm hover:border-blue-600/50 hover:bg-blue-50/10"
                                asChild
                            >
                              <Link
                                  href="/auth/signup"
                                  className="flex items-center justify-center gap-2"
                              >
                                <User className="size-4" />
                                Create Account
                              </Link>
                            </Button>
                          </div>

                          <div className="mt-3 border-t pt-3">
                            <p className="text-center text-xs text-muted-foreground">
                              Join TechVerse for exclusive deals and faster checkout
                            </p>
                          </div>
                        </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className={cn(
                        "relative hover:bg-white/10",
                        isScrolled ? "text-foreground" : "text-white",
                    )}
                >
                  <Link href="/cart">
                    <ShoppingCart className="size-5" />
                    {cartItemsCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs text-white">
                      {cartItemsCount}
                    </span>
                    )}
                  </Link>
                </Button>
              </div>

              {/* Mobile menu button */}
              <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                      "lg:hidden hover:bg-white/10",
                      isScrolled ? "text-foreground" : "text-white",
                  )}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
              >
                <Menu className="size-5" />
              </Button>
            </div>
          </div>

          {/* Overlay Mobile Menu */}
          <OverlayMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              isAuthenticated={isAuthenticated}
              user={user || {}}
              logout={logout}
              categories={categories}
              cartItemsCount={cartItemsCount}
          />
        </div>
      </header>
  );
};

export default Header;