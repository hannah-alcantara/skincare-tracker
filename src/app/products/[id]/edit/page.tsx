"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductById } from "@/services/productService";
import { Product } from "@/utils/supabase/types";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProductForm from "@/components/product-form";


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


  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <p className='text-red-600'>Error: {error || "Product not found"}</p>
          <Button onClick={() => router.push("/products")} className='mt-4'>
            Back to Products
          </Button>
        </div>
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
