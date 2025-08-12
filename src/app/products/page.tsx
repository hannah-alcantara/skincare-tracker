"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Product } from "@/utils/supabase/types";
import { deleteProduct, getProducts } from "@/services/productService";
import ProductCard from "@/components/product-card";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to determine if a product is finished/expired
  const isProductFinished = (product: Product): boolean => {
    // Product is finished if it has a date_finished
    if (product.date_finished) {
      return true;
    }
    
    // Product is expired if expiration_date has passed
    if (product.expiration_date) {
      const now = new Date();
      const expirationDate = new Date(product.expiration_date);
      return expirationDate < now;
    }
    
    return false;
  };

  // Separate products into active and finished
  const activeProducts = products.filter(product => !isProductFinished(product));
  const finishedProducts = products.filter(product => isProductFinished(product));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        console.log(data);
      } catch (error) {
        setError("Failed to load products. Please try again.");
        console.error("Product loading error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      // Remove the deleted product from local state
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
    } catch (error) {
      console.error('Failed to delete product:', error);
      // Handle error (show toast, etc.)
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
          <p className='text-muted-foreground'>
            Manage your skincare product collection
          </p>
        </div>
        <Button asChild>
          <Link href='/products/add'>Add Product</Link>
        </Button>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            Filter & Search
          </CardTitle>
        </CardHeader>

        {/* Dropdowns for filter */}
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-6'>
            <div className='lg:col-span-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Input placeholder='Search products...' className='pl-9' />
              </div>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Product Type' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem>All Types</SelectItem> */}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Brand' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem>All Types</SelectItem> */}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem>All Types</SelectItem> */}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem>All Types</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Tabs */}
      <Tabs defaultValue='active' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='active'>Active</TabsTrigger>
          <TabsTrigger value='finished'>Finished</TabsTrigger>
        </TabsList>

        <TabsContent value='active' className='space-y-4'>
          <Card>
            {activeProducts.length > 0 ? (
              <CardContent className='p-6'>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {activeProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <p className='text-muted-foreground'>
                    No active products found
                  </p>
                  <Button asChild className='mt-4'>
                    <Link href='/products/add'>Add your first product</Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        <TabsContent value='finished' className='space-y-4'>
          <Card>
            {finishedProducts.length > 0 ? (
              <CardContent className='p-6'>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {finishedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <p className='text-muted-foreground'>No finished products</p>
                  <Button asChild className='mt-4'>
                    <Link href='/products/add'>Add your first product</Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
