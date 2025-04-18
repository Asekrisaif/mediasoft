"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Star,
  Truck,
  Shield,
  ArrowRight,
  Box,
  Cpu,
  MemoryStick as Memory,
  Zap,
  HardDrive,
  Heart,
  Share2,
  ShoppingCart,
  Award,
  Check,
  ChevronRight,
  Gift,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductPageClient({ product }: { product: any }) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      points: product.points || Math.floor(product.price), // Default to price if points not set
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Your review has been submitted and is pending approval.");
      setReviewText("");
      setReviewName("");
      setReviewEmail("");
      setReviewRating(5);
      setIsSubmitting(false);
      setShowReviewForm(false);
    }, 1500);
  };

  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000",
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Alex Chen",
      date: "2 months ago",
      rating: 5,
      content:
        "This product exceeded my expectations. The performance is incredible and the build quality is top-notch. Highly recommend for any tech enthusiast!",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200",
      verified: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      date: "3 weeks ago",
      rating: 4,
      content:
        "Great product overall. Fast performance and sleek design. The only minor issue is that it runs a bit hot under heavy load, but that's expected with this level of power.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      verified: true,
    },
    {
      id: 3,
      name: "Michael Torres",
      date: "1 month ago",
      rating: 5,
      content:
        "Absolutely worth every penny. The specs are impressive and it handles everything I throw at it with ease. Customer service was also excellent when I had questions about setup.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      verified: false,
    },
  ];

  // Calculate rating distribution
  const ratingDistribution = [
    { stars: 5, count: 78 },
    { stars: 4, count: 24 },
    { stars: 3, count: 8 },
    { stars: 2, count: 3 },
    { stars: 1, count: 2 },
  ];

  const totalReviews = ratingDistribution.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const averageRating =
    ratingDistribution.reduce((sum, item) => sum + item.stars * item.count, 0) /
    totalReviews;

  // Related products
  const relatedProducts = [
    {
      id: 101,
      name: "Neural GPU 16GB",
      price: 1299.99,
      image:
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
      rating: 4.7,
    },
    {
      id: 102,
      name: "Quantum RAM 64GB",
      price: 499.99,
      image:
        "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800",
      rating: 4.8,
    },
    {
      id: 103,
      name: "HoloCooling System",
      price: 299.99,
      image:
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
      rating: 4.6,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">
          Home
        </a>
        <ChevronRight className="mx-2 size-4" />
        <a href="/store" className="hover:text-primary">
          Store
        </a>
        <ChevronRight className="mx-2 size-4" />
        <a
          href={`/category/${product.category.toLowerCase()}`}
          className="hover:text-primary"
        >
          {product.category}
        </a>
        <ChevronRight className="mx-2 size-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {productImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden rounded-xl bg-black/5 backdrop-blur-xl">
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="size-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition hover:border-primary hover:opacity-75"
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="size-full object-cover"
                />
              </div>
            ))}
            <div className="flex aspect-square cursor-pointer items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-muted/80">
              <span>360° View</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="size-5" />
                </Button>
              </div>
            </div>
            <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-5 ${
                      star <= product.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Points Badge */}
            <div className="mt-4 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary/10 text-primary"
              >
                <Gift className="size-4" />
                Earn {product.points || Math.floor(product.price)} Points
              </Badge>
              <span className="text-sm text-muted-foreground">
                ≈ $
                {((product.points || Math.floor(product.price)) * 0.01).toFixed(
                  2,
                )}{" "}
                value
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive" className="ml-2">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={product.stock > 0 ? "success" : "destructive"}
                className="px-3 py-1"
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 px-3 py-1 text-blue-700"
              >
                <Award className="mr-1 size-4" /> Top Rated
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">
              Experience unparalleled performance with the {product.name}.
              Designed for professionals and enthusiasts who demand the best,
              this cutting-edge device combines state-of-the-art technology with
              sleek design. Whether you're gaming, creating content, or running
              complex simulations, this powerhouse delivers exceptional speed
              and reliability.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {Object.entries(product.specs)
                .slice(0, 4)
                .map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Check className="size-4 text-green-500" />
                    <span className="text-sm">
                      <span className="font-medium capitalize">{key}:</span>{" "}
                      {value as string}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button
                  className="px-4 py-2 hover:bg-muted disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                >
                  -
                </button>
                <span className="min-w-12 border-x px-4 py-2 text-center">
                  {quantity}
                </span>
                <button
                  className="px-4 py-2 hover:bg-muted disabled:opacity-50"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={product.stock === 0 || quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 size-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y py-6">
            <div className="flex items-center gap-2">
              <Truck className="size-5 text-blue-600" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">
                  On orders over $100
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-purple-600" />
              <div>
                <p className="font-medium">2 Year Warranty</p>
                <p className="text-sm text-muted-foreground">Full coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="specs" className="mb-16 w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        <TabsContent
          value="specs"
          className="mt-4 space-y-4 rounded-lg bg-card p-6"
        >
          <h3 className="mb-4 text-xl font-semibold">
            Technical Specifications
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(product.specs).map(([key, value], index) => (
              <div
                key={key}
                className={`rounded-lg p-4 ${index % 2 === 0 ? "bg-muted/50" : "bg-muted/30"}`}
              >
                <p className="mb-1 text-sm capitalize text-muted-foreground">
                  {key}
                </p>
                <p className="font-medium">{value as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-blue-800">
            <h4 className="mb-2 font-semibold">Compatibility Information</h4>
            <p className="text-sm">
              This product is compatible with all major operating systems
              including Windows 11, macOS, and Linux. For optimal performance,
              we recommend using with the latest drivers available on our
              support website.
            </p>
          </div>
        </TabsContent>

        <TabsContent
          value="features"
          className="mt-4 space-y-6 rounded-lg bg-card p-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6">
              <Cpu className="mb-4 size-8 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Advanced Processing Architecture
              </h3>
              <p className="text-sm text-muted-foreground">
                Featuring the latest neural processing units for unparalleled
                computational power and efficiency.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
              <Memory className="mb-4 size-8 text-purple-600" />
              <h3 className="mb-2 text-lg font-semibold">
                High-Speed Memory System
              </h3>
              <p className="text-sm text-muted-foreground">
                Ultra-fast memory architecture ensures smooth multitasking and
                responsive performance.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
              <Zap className="mb-4 size-8 text-emerald-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Energy Efficient Design
              </h3>
              <p className="text-sm text-muted-foreground">
                Optimized power management system reduces energy consumption
                while maintaining peak performance.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6">
              <HardDrive className="mb-4 size-8 text-amber-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Expandable Storage Options
              </h3>
              <p className="text-sm text-muted-foreground">
                Multiple expansion slots support additional storage for growing
                data needs.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-red-50 to-rose-50 p-6">
              <Shield className="mb-4 size-8 text-red-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Advanced Security Features
              </h3>
              <p className="text-sm text-muted-foreground">
                Built-in hardware encryption and secure boot technology protect
                your sensitive data.
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
              <Box className="mb-4 size-8 text-sky-600" />
              <h3 className="mb-2 text-lg font-semibold">
                Premium Build Quality
              </h3>
              <p className="text-sm text-muted-foreground">
                Constructed with high-grade materials for durability and optimal
                thermal performance.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">
              Performance Benchmarks
            </h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">
                    Gaming Performance
                  </span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Content Creation</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Productivity</span>
                  <span className="text-sm font-medium">99%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
              <div>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium">Energy Efficiency</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="reviews"
          className="mt-4 space-y-6 rounded-lg bg-card p-6"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="rounded-xl bg-muted/30 p-6">
                <h3 className="mb-2 text-2xl font-bold">
                  {averageRating.toFixed(1)}
                </h3>
                <div className="mb-4 flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-5 ${
                        star <= Math.round(averageRating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    Based on {totalReviews} reviews
                  </span>
                </div>

                <div className="space-y-2">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-2">
                      <div className="flex w-12 items-center">
                        <span className="text-sm">{item.stars}</span>
                        <Star className="ml-1 size-4 fill-yellow-500 text-yellow-500" />
                      </div>
                      <Progress
                        value={(item.count / totalReviews) * 100}
                        className="h-2 flex-1"
                      />
                      <span className="w-10 text-right text-sm text-muted-foreground">
                        {Math.round((item.count / totalReviews) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Write a Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                      <DialogDescription>
                        Share your experience with this product to help other
                        customers make informed decisions.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmitReview}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`size-6 ${
                                  star <= reviewRating
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Your Review
                        </label>
                        <Textarea
                          placeholder="Share your experience with this product..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="min-h-[120px]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Your Name
                          </label>
                          <Input
                            placeholder="Enter your name"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Your Email
                          </label>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            value={reviewEmail}
                            onChange={(e) => setReviewEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="mb-4 text-lg font-semibold">Customer Reviews</h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="mr-3 size-10">
                          <AvatarImage src={review.avatar} alt={review.name} />
                          <AvatarFallback>
                            {review.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{review.name}</h4>
                            {review.verified && (
                              <Badge
                                variant="outline"
                                className="ml-2 border-green-200 bg-green-50 text-xs text-green-700"
                              >
                                <Check className="mr-1 size-3" /> Verified
                                Purchase
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= review.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.content}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Helpful (12)
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                Load More Reviews
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="support"
          className="mt-4 space-y-6 rounded-lg bg-card p-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-muted/30 p-6">
              <h3 className="mb-4 text-lg font-semibold">Technical Support</h3>
              <p className="mb-4 text-muted-foreground">
                Our dedicated technical support team is available 24/7 to assist
                you with any questions or issues you may encounter.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 01-1.21.502l-4.493-1.498a1 1 0 00-.684-.948A19.38 19.38 0 012 12C2 6.477 6.477 2 12 2h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">
                      1-800-TECH-HELP
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">
                      support@techstore.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">
                      Available 24/7
                    </p>
                  </div>
                </div>
              </div>
              <Button className="mt-6 w-full">Contact Support</Button>
            </div>

            <div className="rounded-xl bg-muted/30 p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Warranty Information
              </h3>
              <p className="mb-4 text-muted-foreground">
                This product comes with a comprehensive 2-year warranty covering
                manufacturing defects and performance issues.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-5 text-green-500" />
                  <p className="text-sm">
                    Full coverage for manufacturing defects
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-5 text-green-500" />
                  <p className="text-sm">Free repair or replacement service</p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-5 text-green-500" />
                  <p className="text-sm">
                    Express shipping for warranty claims
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-5 text-green-500" />
                  <p className="text-sm">
                    Option to extend warranty for up to 5 years
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-0.5 size-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-amber-800">
                      Register Your Product
                    </p>
                    <p className="text-sm text-amber-700">
                      Don't forget to register your product within 30 days of
                      purchase to activate your warranty coverage.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full">
                Download Warranty Information
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-4 text-xl font-semibold">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-4">
                <h4 className="mb-2 font-medium">
                  How do I update the drivers for this product?
                </h4>
                <p className="text-sm text-muted-foreground">
                  You can download the latest drivers from our support portal.
                  Simply enter your product serial number and select your
                  operating system to get the appropriate drivers.
                </p>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <h4 className="mb-2 font-medium">
                  What is the return policy for this product?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day satisfaction guarantee. If you're not
                  completely satisfied, you can return the product in its
                  original packaging for a full refund or exchange.
                </p>
              </div>
              <div className="rounded-lg bg-muted/30 p-4">
                <h4 className="mb-2 font-medium">
                  Is this product compatible with older systems?
                </h4>
                <p className="text-sm text-muted-foreground">
                  This product is designed to be backward compatible with most
                  systems from the last 5 years. Check the compatibility section
                  in the specifications tab for detailed requirements.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <Button variant="ghost" className="gap-2">
            View All <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border transition hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-full object-cover transition hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-medium">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${item.price}</span>
                  <div className="flex items-center">
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 text-sm">{item.rating}</span>
                  </div>
                </div>
                <Button className="mt-4 w-full">View Product</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recently Viewed</h2>
          <Button variant="ghost" className="gap-2">
            View History <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border p-3 transition hover:shadow-md"
            >
              <div className="mb-3 aspect-square overflow-hidden rounded-md bg-muted">
                <img
                  src={`https://images.unsplash.com/photo-158720237267${index}-e229f172b9d7?auto=format&fit=crop&q=80&w=500`}
                  alt={`Recently viewed item ${index + 1}`}
                  className="size-full object-cover"
                />
              </div>
              <h3 className="truncate text-sm font-medium">
                Recently Viewed Product {index + 1}
              </h3>
              <span className="text-sm font-bold">
                ${(199.99 + index * 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
