"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/lib/store";
import { Star } from "lucide-react";

// Mock data for products
const products = {
  "new-arrivals": [
    {
      id: 1,
      name: "Premium Leather Tote",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      name: "Designer Watch",
      price: 599.99,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviews: 15,
    },
  ],
  women: [
    {
      id: 3,
      name: "Silk Evening Dress",
      price: 399.99,
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      reviews: 42,
    },
    {
      id: 4,
      name: "Designer Handbag",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviews: 31,
    },
  ],
  men: [
    {
      id: 5,
      name: "Italian Suit",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
      reviews: 56,
    },
    {
      id: 6,
      name: "Leather Briefcase",
      price: 499.99,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      reviews: 28,
    },
  ],
  accessories: [
    {
      id: 7,
      name: "Designer Sunglasses",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
      rating: 4.6,
      reviews: 45,
    },
    {
      id: 8,
      name: "Luxury Watch",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
      rating: 4.9,
      reviews: 37,
    },
  ],
  sale: [
    {
      id: 9,
      name: "Classic Leather Belt",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      rating: 4.5,
      reviews: 62,
      originalPrice: 129.99,
    },
    {
      id: 10,
      name: "Designer Scarf",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
      reviews: 41,
      originalPrice: 249.99,
    },
  ],
};

const categoryTitles = {
  "new-arrivals": "New Arrivals",
  women: "Women's Collection",
  men: "Men's Collection",
  accessories: "Accessories",
  sale: "Sale Items",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCartStore();

  const categoryProducts = products[slug as keyof typeof products] || [];
  const categoryTitle =
    categoryTitles[slug as keyof typeof categoryTitles] || "Products";

  const handleAddToCart = (product: (typeof categoryProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">{categoryTitle}</h1>
          <p className="mt-1 text-muted-foreground">
            {categoryProducts.length} products available
          </p>
        </div>
        <div className="flex gap-4">
          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Best Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {categoryProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center text-primary">
                  <Star className="size-4 fill-current" />
                  <span className="ml-1">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="font-bold">${product.price}</span>
                  {"originalPrice" in product && (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <Button onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
