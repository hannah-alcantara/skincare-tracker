"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm from "@/components/product-form";

export default function AddProductPage() {

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Add Product</h1>
        <p className='text-muted-foreground'>
          Add a new product to your collection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm mode="add" />
        </CardContent>
      </Card>
    </div>
  );
}
