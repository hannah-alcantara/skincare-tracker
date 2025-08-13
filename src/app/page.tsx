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
import { 
  formatDate, 
  getProductStatus, 
  getBadgeProps,
  sortProductsByExpiration 
} from "@/lib/date-utils";
import { LoadingPage } from "@/components/loading-page";


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

  // Get products expiring soon, sorted by expiration date
  const upcomingExpirations = sortProductsByExpiration(
    products.filter(p => getProductStatus(p) === "expiring-soon" && p.expiration_date)
  ).slice(0, 5); // Show top 5 expiring products

  // Calculate product type counts
  const productTypeCounts = products.reduce((acc, product) => {
    if (product.type) {
      acc[product.type] = (acc[product.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Sort product types by count (highest first) and take top 5
  const topProductTypes = Object.entries(productTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);




  if (loading) {
    return <LoadingPage variant="dashboard" message="Loading dashboard" />;
  }

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
            {loading ? (
              <div className='space-y-4'>
                <div className='text-sm text-muted-foreground'>Loading...</div>
              </div>
            ) : upcomingExpirations.length > 0 ? (
              <div className='space-y-4'>
                {upcomingExpirations.map((product) => (
                  <div key={product.id} className='flex items-center justify-between'>
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>
                        {product.brand} {product.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>{product.type}</p>
                    </div>
                    <div className='text-right space-y-1'>
                      <Badge
                        variant={getBadgeProps(product).variant}
                        className={getBadgeProps(product).className}
                      >
                        {product.expiration_date && formatDate(product.expiration_date)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-sm text-muted-foreground'>
                No products expiring in the next 30 days
              </div>
            )}
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
            {loading ? (
              <div className='space-y-4'>
                <div className='text-sm text-muted-foreground'>Loading...</div>
              </div>
            ) : topProductTypes.length > 0 ? (
              <div className='space-y-3'>
                {topProductTypes.map(([type, count]) => (
                  <div key={type} className='flex items-center justify-between'>
                    <span className='text-sm font-medium capitalize'>{type}</span>
                    <div className='text-right'>
                      <Badge variant='secondary'>{count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-sm text-muted-foreground'>
                No product types found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
