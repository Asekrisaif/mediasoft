import ProductPageClient from '@/components/ProductPageClient'
import { products } from '@/lib/data'

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id)
  
  // Flatten all products from different categories
  const allProducts = Object.values(products).flat()
  
  // Find the product by ID
  const product = allProducts.find((p) => p.id === productId)
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <a href="/" className="btn">
          Return to Home
        </a>
      </div>
    )
  }
  
  return <ProductPageClient product={product} />
}

export function generateStaticParams() {
  // Flatten all products from different categories
  const allProducts = Object.values(products).flat()
  
  // Generate static params for all products
  return allProducts.map((product) => ({ 
    id: product.id.toString() 
  }))
}