"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ArrowRight,
  Cpu,
  MemoryStick as Memory,
  Zap,
  HardDrive,
  Shield,
  Truck,
  ChevronRight,
  Sparkles,
  Headphones,
  Smartphone,
  Laptop,
  Monitor,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { AIRecommendations } from "@/components/ai-recommendations";
import { CustomerStories } from "@/components/CustomerStories";
import { motion, AnimatePresence } from "framer-motion";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80",
    overlayImage:
      "https://images.unsplash.com/photo-1649859398021-afbfe80e83b9?auto=format&fit=crop&w=800&q=80",
    title: "Next-Gen Computing",
    subtitle: "Quantum Series",
    description:
      "Experience unprecedented power with our latest quantum computing technology",
    features: ["Neural X9 Processor", "32GB DDR5 RAM", "RTX 5080 Ti Graphics"],
    stats: [
      { label: "Performance", value: "5.5 GHz" },
      { label: "Memory", value: "32GB" },
      { label: "Storage", value: "2TB" },
    ],
    cta: "Explore Products",
    link: "/store",
    theme: "from-blue-600 to-indigo-600",
    accent: "blue",
  },
  {
    image:
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=1920",
    overlayImage:
      "https://images.unsplash.com/photo-1633886038251-66951c209216?auto=format&fit=crop&q=80&w=800",
    title: "Revolutionary AR",
    subtitle: "HoloVerse Pro",
    description:
      "Step into new dimensions with our groundbreaking AR technology",
    features: ["8K Resolution", "150° Field of View", "Neural Tracking"],
    stats: [
      { label: "Resolution", value: "8K" },
      { label: "Battery", value: "8hrs" },
      { label: "Weight", value: "380g" },
    ],
    cta: "Discover AR/VR",
    link: "/category/ar-vr",
    theme: "from-purple-600 to-pink-600",
    accent: "purple",
  },
  {
    image:
      "https://images.unsplash.com/photo-1624969862644-791f3dc98927?auto=format&fit=crop&q=80&w=1920",
    overlayImage:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    title: "Ultimate Gaming",
    subtitle: "Neural GPU Series",
    description:
      "Dominate every game with our most powerful graphics cards yet",
    features: ["24576 CUDA Cores", "32GB GDDR7", "Ray Tracing 5.0"],
    stats: [
      { label: "VRAM", value: "32GB" },
      { label: "Cores", value: "24K" },
      { label: "Clock", value: "3.2GHz" },
    ],
    cta: "Shop GPUs",
    link: "/category/components",
    theme: "from-emerald-600 to-teal-600",
    accent: "emerald",
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Quantum X Pro Gaming Laptop",
    price: 2499.99,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
    category: "Laptops",
    rating: 4.8,
    reviews: 124,
    badge: "New Release",
  },
  {
    id: 2,
    name: "Neural GPU 32GB",
    price: 1999.99,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    category: "Components",
    rating: 4.9,
    reviews: 89,
    badge: "Best Seller",
  },
  {
    id: 3,
    name: "HoloLens Pro AR",
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800",
    category: "AR/VR",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "Quantum Core Desktop",
    price: 3499.99,
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800",
    category: "Desktops",
    rating: 4.9,
    reviews: 78,
    badge: "Limited Edition",
  },
];

const categories = [
  {
    name: "Gaming PCs",
    image:
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800",
    icon: <Cpu className="size-6" />,
    description: "Custom-built gaming rigs",
    color: "from-blue-600 to-indigo-600",
  },
  {
    name: "Components",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    icon: <Memory className="size-6" />,
    description: "High-performance parts",
    color: "from-purple-600 to-pink-600",
  },
  {
    name: "AR/VR",
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800",
    icon: <HardDrive className="size-6" />,
    description: "Immersive experiences",
    color: "from-emerald-600 to-teal-600",
  },
  {
    name: "Laptops",
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800",
    icon: <Laptop className="size-6" />,
    description: "Portable powerhouses",
    color: "from-amber-600 to-orange-600",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    categories: false,
    featured: false,
    ai: false,
    testimonials: false,
  });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      setCurrentSlide(
        (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
      );
    }
  };

  // Then in your startSlideTimer function
  const startSlideTimer = () => {
    if (slideTimerRef.current) {
      clearTimeout(slideTimerRef.current);
    }

    slideTimerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  useEffect(() => {
    startSlideTimer();

    setIsVisible({
      hero: true,
      categories: true,
      featured: true,
      ai: true,
      testimonials: true,
    });

    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [currentSlide]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative flex h-screen items-center justify-center overflow-hidden"
        initial="hidden"
        animate={isVisible.hero ? "visible" : "hidden"}
        variants={fadeInUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {heroSlides.map(
            (slide, index) =>
              currentSlide === index && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      filter: "brightness(0.4)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="absolute bottom-0 right-0 h-2/3 w-1/3 opacity-60">
                    <img
                      src={slide.overlayImage}
                      alt=""
                      className="size-full object-cover"
                      style={{
                        maskImage:
                          "linear-gradient(to left, black, transparent)",
                      }}
                    />
                  </div>
                </motion.div>
              ),
          )}
        </AnimatePresence>

        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              key={`content-${currentSlide}`}
              className="text-white"
            >
              <Badge
                className={`bg- mb-4${heroSlides[currentSlide].accent}-500/20 text-${heroSlides[currentSlide].accent}-400 border- backdrop-blur-sm${heroSlides[currentSlide].accent}-500/30`}
              >
                {heroSlides[currentSlide].subtitle}
              </Badge>
              <h1
                className={`mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl ${heroSlides[currentSlide].theme}`}
              >
                {heroSlides[currentSlide].title}
              </h1>
              <p className="mb-8 max-w-xl text-xl text-gray-300">
                {heroSlides[currentSlide].description}
              </p>

              <div className="mb-8 grid grid-cols-3 gap-4">
                {heroSlides[currentSlide].stats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm"
                  >
                    <div
                      className={`text- text-2xl font-bold${heroSlides[currentSlide].accent}-400`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mb-8 space-y-3">
                {heroSlides[currentSlide].features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div
                      className={`bg- size-1.5 rounded-full${heroSlides[currentSlide].accent}-500`}
                    />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${heroSlides[currentSlide].theme} rounded-full hover:opacity-90`}
                  asChild
                >
                  <Link href={heroSlides[currentSlide].link}>
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              key={`image-${currentSlide}`}
              className="hidden lg:block"
            >
              <div className="relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].theme} rounded-2xl opacity-20 blur-3xl`}
                />
                <img
                  src={heroSlides[currentSlide].overlayImage}
                  alt={heroSlides[currentSlide].title}
                  className="relative rounded-2xl shadow-2xl"
                />
                <div
                  className={`absolute -bottom-6 -right-6 bg-gradient-to-r ${heroSlides[currentSlide].theme} w-2/3 rounded-2xl p-6 backdrop-blur-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-white/20 p-3">
                      <Zap className="size-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        Performance Score
                      </div>
                      <div className="text-sm text-white/80">
                        98% Faster than competitors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-md transition-all hover:bg-white/40"
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
              )
            }
          >
            <ChevronLeft className="size-5 text-white" />
          </Button>
        </div>
        <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-md transition-all hover:bg-white/40"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
            }
          >
            <ChevronRight className="size-5 text-white" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 ${
                currentSlide === index
                  ? "w-12 bg-white"
                  : "w-3 bg-white/50 hover:bg-white/75"
              } h-3 rounded-full`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section
        className="bg-gradient-to-b from-background to-background/50 py-24"
        initial="hidden"
        animate={isVisible.categories ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4">Browse Categories</Badge>
            <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Cutting-Edge Technology
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Discover our wide range of next-generation tech products designed
              for performance and innovation
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/store?category=${category.name.toLowerCase().replace(" ", "-")}`}
                  className="group block"
                >
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 transition-opacity group-hover:opacity-70`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                      <div className="mb-4 rounded-full bg-white/20 p-4 backdrop-blur-xl transition-transform group-hover:scale-110">
                        {category.icon}
                      </div>
                      <h3 className="mb-2 text-2xl font-bold">
                        {category.name}
                      </h3>
                      <p className="text-center text-white/90">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="group rounded-full"
              asChild
            >
              <Link href="/store">
                View All Categories
                <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* AI Recommendations section */}
      <motion.section
        className="bg-black/5 py-24 backdrop-blur-xl"
        initial="hidden"
        animate={isVisible.ai ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4">Personalized For You</Badge>
            <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              AI-Powered Recommendations
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our advanced AI analyzes your preferences to suggest products that
              match your unique tech needs
            </p>
          </div>
          <AIRecommendations />
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        className="py-24"
        initial="hidden"
        animate={isVisible.featured ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge className="mb-4">Top Picks</Badge>
            <h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Featured Products
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Discover our most popular tech products, handpicked for
              exceptional performance and innovation
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group flex h-full flex-col overflow-hidden">
                  <Link
                    href={`/product/${product.id}`}
                    className="flex flex-1 flex-col"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      {product.badge && (
                        <Badge className="absolute left-2 top-2 bg-primary/90 backdrop-blur-sm">
                          {product.badge}
                        </Badge>
                      )}
                      <Badge className="absolute right-2 top-2 bg-black/70 backdrop-blur-sm">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
                        {product.name}
                      </h3>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex items-center text-yellow-500">
                          <Star className="size-4 fill-current" />
                          <span className="ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <p className="text-xl font-bold">${product.price}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="group rounded-full"
              asChild
            >
              <Link href="/store">
                View All Products
                <ChevronRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <CustomerStories />

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl transition-shadow hover:shadow-lg">
              <div className="mb-6 flex justify-center">
                <div className="rounded-xl bg-blue-600/10 p-4">
                  <Truck className="size-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-semibold">
                Fast Shipping
              </h3>
              <p className="text-center text-muted-foreground">
                Free express shipping on orders over $100, with guaranteed
                delivery within 2 business days
              </p>
            </div>
            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl transition-shadow hover:shadow-lg">
              <div className="mb-6 flex justify-center">
                <div className="rounded-xl bg-purple-600/10 p-4">
                  <Shield className="size-8 text-purple-600" />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-semibold">
                Extended Warranty
              </h3>
              <p className="text-center text-muted-foreground">
                All products come with a 2-year extended warranty and 30-day
                money-back guarantee
              </p>
            </div>
            <div className="rounded-2xl bg-white/50 p-8 backdrop-blur-xl transition-shadow hover:shadow-lg">
              <div className="mb-6 flex justify-center">
                <div className="rounded-xl bg-blue-600/10 p-4">
                  <Sparkles className="size-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-3 text-center text-xl font-semibold">
                Expert Support
              </h3>
              <p className="text-center text-muted-foreground">
                24/7 technical assistance from our team of certified tech
                specialists for all your needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Stay Updated</Badge>
            <h2 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Join Our Tech Community
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Subscribe to our newsletter for exclusive tech news, product
              launches, and special offers delivered directly to your inbox
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-full border border-input bg-background/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button className="h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
