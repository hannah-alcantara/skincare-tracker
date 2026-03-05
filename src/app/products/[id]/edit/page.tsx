"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductById } from "@/services/productService";
import { Product } from "@/utils/supabase/types";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProductForm from "@/components/product-form";
import { LoadingPage } from "@/components/loading-page";
import { AlertTriangle } from "lucide-react";


export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);


  if (loading) return <LoadingPage variant="products" message="Loading product" />;

  if (error || !product) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <Card className='w-full max-w-md text-center'>
          <CardContent className='pt-6 space-y-4'>
            <AlertTriangle className='h-10 w-10 text-destructive mx-auto' />
            <p className='text-muted-foreground'>{error || "Product not found"}</p>
            <Button onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Edit Product</h1>
        <p className='text-muted-foreground'>Update your product details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            mode="edit"
            initialData={product}
            productId={productId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
