import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ProductCardProps } from "@/utils/supabase/types";

interface ProductCardPropsWithDelete extends ProductCardProps {
  onDelete: (productId: string) => Promise<void>;
}

export default function ProductCard({
  product,
  onDelete,
}: ProductCardPropsWithDelete) {
  const handleDelete = async () => await onDelete(product.id);

  return (
    <Card className='relative'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>{product.brand}</CardTitle>
            <p className='text-sm text-muted-foreground'>{product.name}</p>
          </div>
          <div className='flex gap-2'>
            {/* Edit button - links to dedicated edit page */}
            <Button variant='ghost' size='sm' asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Edit className='h-4 w-4' />
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-red-600 hover:text-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product "{product.brand} - {product.name}".
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                  </DialogClose>
                  <Button variant='destructive' onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between'>
          <Badge variant='outline'>{product.type}</Badge>
          {/* You can add status logic here later */}
          <Badge>Active</Badge>
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Expires:</span>
            <span>{product.expiration_date || "Not set"}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Opened:</span>
            <span>{product.date_opened || "Not set"}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Price:</span>
            <span>${product.price || "0.00"}</span>
          </div>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {product.tags.map((tag, index) => (
              <Badge key={index} variant='secondary' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {product.notes && (
          <p className='text-xs text-muted-foreground bg-muted p-2 rounded'>
            {product.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
