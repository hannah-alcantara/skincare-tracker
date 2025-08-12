"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/utils/supabase/types";
import { getProducts } from "@/services/productService";
import { useEffect, useState } from "react";
import {
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
} from "lucide-react";

// helper function to determine product status
const getProductStatus = (product: Product) => {
  const now = new Date();

  // Product is finished if it has a date_finished
  if (product.date_finished) {
    return "finished";
  }

  if (product.expiration_date) {
    const expirationDate = new Date(product.expiration_date);
    const timeDiff = expirationDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return "expired";
    } else if (daysDiff <= 30) {
      return "expiring-soon";
    }
  }
  return "active";
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => getProductStatus(p) === "active").length;
  const expiringSoonProducts = products.filter(p => getProductStatus(p) === "expiring-soon").length;
  const expiredProducts = products.filter(p => getProductStatus(p) === "expired").length;

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='font-bold text-3xl'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Overview of your skincare products and expiration dates
        </p>
      </div>

      {/* Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Products
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? "..." : totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Products
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? "..." : activeProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Expiring Soon</CardTitle>
            <AlertTriangle className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? "..." : expiringSoonProducts}</div>
            <p className='text-xs text-muted-foreground'>Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Expired</CardTitle>
            <AlertTriangle className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{loading ? "..." : expiredProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Expirations */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              Upcoming Expirations
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Brand and Name</p>
                  <p className='text-xs text-muted-foreground'>Type</p>
                </div>
                <div className='text-right space-y-1'>
                  <Badge>MM-DD-YYYY</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Types */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FlaskConical className='h-5 w-5' />
              Product Types
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Type</span>

                <div className='text-right space-y-1'>
                  <Badge variant='secondary'>count</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
