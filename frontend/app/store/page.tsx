"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Filter, SlidersHorizontal, Search, X, ChevronDown, Cpu, MemoryStick, Laptop, Smartphone, Headphones, Monitor } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { products } from '@/lib/data'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const allProducts = Object.values(products).flat()

const categories = [
  { name: 'All Categories', value: 'all', icon: <SlidersHorizontal className="h-5 w-5" /> },
  { name: 'Laptops', value: 'laptops', icon: <Laptop className="h-5 w-5" /> },
  { name: 'Desktops', value: 'desktops', icon: <Monitor className="h-5 w-5" /> },
  { name: 'Components', value: 'components', icon: <MemoryStick className="h-5 w-5" /> },
  { name: 'GPUs', value: 'gpus', icon: <Cpu className="h-5 w-5" /> },
  { name: 'AR/VR', value: 'ar/vr', icon: <Headphones className="h-5 w-5" /> },
  { name: 'Accessories', value: 'accessories', icon: <Smartphone className="h-5 w-5" /> },
]

const brands = [
  'Quantum', 'Neural', 'HoloTech', 'NanoTech', 'TechVerse'
]

export default function StorePage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  
  const [filters, setFilters] = useState({
    category: initialCategory.toLowerCase(),
    priceRange: [0, 5000],
    inStock: false,
    brands: [] as string[],
    rating: 0,
    sort: 'featured',
    search: '',
  })
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
      
      return { ...prev, brands: newBrands }
    })
  }
  
  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: [0, 5000],
      inStock: false,
      brands: [],
      rating: 0,
      sort: 'featured',
      search: '',
    })
  }
  
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (filters.category !== 'all' && !product.category.toLowerCase().includes(filters.category)) {
      return false
    }
    
    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }
    
    // In stock filter
    if (filters.inStock && product.stock === 0) {
      return false
    }
    
    // Brand filter
    if (filters.brands.length > 0) {
      const productBrand = product.name.split(' ')[0]
      if (!filters.brands.includes(productBrand)) {
        return false
      }
    }
    
    // Rating filter
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false
    }
    
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id - a.id
      default:
        return 0
    }
  })

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen pt-16">
      
      

      {/* Category Pills */}
      <div className="container mx-auto px-4 py-6 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={filters.category === category.value ? "default" : "outline"}
              className="rounded-full flex items-center gap-2 whitespace-nowrap"
              onClick={() => setFilters({ ...filters, category: category.value })}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
            
            <Accordion type="single" collapsible defaultValue="price" className="w-full">
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={5000}
                      step={100}
                      value={filters.priceRange}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                      className="mb-6"
                    />
                    <div className="flex justify-between items-center">
                      <div className="bg-muted/50 rounded-md px-3 py-1">
                        ${filters.priceRange[0]}
                      </div>
                      <div className="text-muted-foreground">to</div>
                      <div className="bg-muted/50 rounded-md px-3 py-1">
                        ${filters.priceRange[1]}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="brands">
                <AccordionTrigger>Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`brand-${brand}`} 
                          checked={filters.brands.includes(brand)}
                          onCheckedChange={() => handleBrandToggle(brand)}
                        />
                        <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="rating">
                <AccordionTrigger>Rating</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <div 
                        key={rating} 
                        className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                          filters.rating === rating ? 'bg-muted' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setFilters({ ...filters, rating: filters.rating === rating ? 0 : rating })}
                      >
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm">& Up</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="availability">
                <AccordionTrigger>Availability</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="stock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked })}
                    />
                    <Label htmlFor="stock">In Stock Only</Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </div>
                  <Badge>{Object.values(filters).flat().filter(v => v !== false && v !== '' && v !== 'all' && v !== 'featured').length}</Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="mb-4">
                    Clear All Filters
                  </Button>
                  
                  <Accordion type="single" collapsible defaultValue="price" className="w-full">
                    <AccordionItem value="price">
                      <AccordionTrigger>Price Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2">
                          <Slider
                            min={0}
                            max={5000}
                            step={100}
                            value={filters.priceRange}
                            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                            className="mb-6"
                          />
                          <div className="flex justify-between items-center">
                            <div className="bg-muted/50 rounded-md px-3 py-1">
                              ${filters.priceRange[0]}
                            </div>
                            <div className="text-muted-foreground">to</div>
                            <div className="bg-muted/50 rounded-md px-3 py-1">
                              ${filters.priceRange[1]}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="brands">
                      <AccordionTrigger>Brands</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {brands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`mobile-brand-${brand}`} 
                                checked={filters.brands.includes(brand)}
                                onCheckedChange={() => handleBrandToggle(brand)}
                              />
                              <Label htmlFor={`mobile-brand-${brand}`} className="cursor-pointer">
                                {brand}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="rating">
                      <AccordionTrigger>Rating</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {[4, 3, 2, 1].map((rating) => (
                            <div 
                              key={rating} 
                              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                                filters.rating === rating ? 'bg-muted' : 'hover:bg-muted/50'
                              }`}
                              onClick={() => setFilters({ ...filters, rating: filters.rating === rating ? 0 : rating })}
                            >
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm">& Up</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="availability">
                      <AccordionTrigger>Availability</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="mobile-stock"
                            checked={filters.inStock}
                            onCheckedChange={(checked) => setFilters({ ...filters, inStock: checked })}
                          />
                          <Label htmlFor="mobile-stock">In Stock Only</Label>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} products
              </p>
              <div className="flex items-center gap-4">
                <Select
                  value={filters.sort}
                  onValueChange={(value) => setFilters({ ...filters, sort: value })}
                >
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

            {isLoading ? (
              // Loading skeleton
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                      <div className="h-6 bg-muted rounded animate-pulse w-1/3 mt-2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {sortedProducts.map((product) => (
                  <motion.div key={product.id} variants={fadeInUp}>
                    <Card className="group overflow-hidden h-full flex flex-col">
                      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Badge className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm">
                            {product.category}
                          </Badge>
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                              <Badge variant="destructive" className="text-sm px-3 py-1">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1">{product.rating}</span>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              ({product.reviews} reviews)
                            </span>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <p className="text-xl font-bold">${product.price}</p>
                            <Button variant="ghost" size="sm" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}