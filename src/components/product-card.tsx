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
import { format } from "date-fns";

interface ProductCardPropsWithDelete extends ProductCardProps {
  onDelete: (productId: string) => Promise<void>;
}

const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "Not set";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM d, yyyy");
};

const getProductStatus = (product: ProductCardProps["product"]) => {
  const now = new Date();

  // Product is finished if it has a date_finished
  if (product.date_finished) {
    return {
      status: "finished",
      label: "Finished",
      variant: "secondary" as const,
      className: "",
    };
  }

  // Check expiration status
  if (product.expiration_date) {
    const expirationDate = new Date(product.expiration_date);
    const timeDiff = expirationDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return {
        status: "expired",
        label: "Expired",
        variant: "destructive" as const,
        className: "",
      };
    } else if (daysDiff <= 30) {
      return {
        status: "expiring-soon",
        label: "Expiring Soon",
        variant: "secondary" as const,
        className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
      };
    }
  }

  return { 
    status: "active", 
    label: "Active", 
    variant: "default" as const,
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
  };
};

export default function ProductCard({
  product,
  onDelete,
}: ProductCardPropsWithDelete) {
  const handleDelete = async () => await onDelete(product.id);
  const productStatus = getProductStatus(product);

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
          <Badge 
            variant={productStatus.variant} 
            className={productStatus.className}
          >
            {productStatus.label}
          </Badge>
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Expires:</span>
            <span>{formatDate(product.expiration_date)}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Opened:</span>
            <span>{formatDate(product.date_opened)}</span>
          </div>

          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Price:</span>
            <span>${product.price ? product.price.toFixed(2) : "0.00"}</span>
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
