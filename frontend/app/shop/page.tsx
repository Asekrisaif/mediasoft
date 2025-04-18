"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Filter, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { products } from "@/lib/data";
import Link from "next/link";

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 5000],
    inStock: false,
    sort: "featured",
  });

  const allProducts = Object.values(products).flat();

  const filteredProducts = allProducts.filter((product) => {
    if (
      filters.category !== "all" &&
      product.category.toLowerCase() !== filters.category
    ) {
      return false;
    }
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }
    if (filters.inStock && product.stock === 0) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const categories = [
    ...new Set(allProducts.map((p) => p.category.toLowerCase())),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full space-y-6 md:w-64">
          <div className="space-y-4 rounded-lg bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Filter className="size-5" />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price Range</Label>
              <div className="pt-2">
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, priceRange: value })
                  }
                />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="stock"
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, inStock: checked })
                }
              />
              <Label htmlFor="stock">In Stock Only</Label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {sortedProducts.length} products
            </p>
            <div className="flex items-center gap-4">
              <Select
                value={filters.sort}
                onValueChange={(value) =>
                  setFilters({ ...filters, sort: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute right-2 top-2 bg-black/50 backdrop-blur-xl">
                      {product.category}
                    </Badge>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      {product.name}
                    </h3>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex items-center text-yellow-500">
                        <Star className="size-4 fill-current" />
                        <span className="ml-1">{product.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold">${product.price}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
