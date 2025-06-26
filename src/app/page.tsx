import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle,
  FlaskConical,
} from "lucide-react";

export default function Home() {
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
            <div className='text-2xl font-bold'>#</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Products
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>#</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Expiring Soon</CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>#</div>
            <p className='text-xs text-muted-foreground'>Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Expired</CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>#</div>
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
