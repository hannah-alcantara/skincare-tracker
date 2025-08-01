import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Product } from "@/utils/supabase/types";
import { deleteProduct } from "@/services/productService";

export interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => Promise<void>;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const handleDelete = async () => {
    await onDelete(product.id)
  }

  return (
    <Card className='relative'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>{product.brand}</CardTitle>
            <p className='text-sm text-muted-foreground'>{product.name}</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='ghost' size='sm' asChild>
              <Link href={""}>
                <Edit className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-red-600 hover:text-red-700'
              onClick={handleDelete}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between'>
          <Badge variant='outline'>{product.type}</Badge>
          {/* Need to add color status function change */}
          <Badge>Status color</Badge>
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Expires:</span>
            {/* Not working */}
            <span>{product.expiration_date}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Opened:</span>
            <span>date</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Price:</span>
            <span>${product.price}</span>
          </div>
        </div>

        <div className='flex flex-wrap gap-1'>
          <Badge variant='secondary' className='text-xs'>
            {product.tags}
          </Badge>
        </div>

        <p className='text-xs text-muted-foreground bg-muted p-2 rounded'>
          notes
        </p>
      </CardContent>
    </Card>
  );
}
