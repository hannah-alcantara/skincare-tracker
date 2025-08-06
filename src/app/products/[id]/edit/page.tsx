"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getProductById, updateProduct } from "@/services/productService";
import { Product, ProductTypes } from "@/utils/supabase/types";
import { format, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

// Zod schema for edit form
const editProductSchema = z
  .object({
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Product name is required"),
    type: z.string().min(1, "Product type is required"),
    date_opened: z.string().optional(),
    date_finished: z.string().optional(),
    expiration_date: z.string().min(1, "Expiration date is required"),
    price: z.number().min(0, "Price must be positive").optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.date_opened && data.expiration_date) {
        const openedDate = stringToDate(data.date_opened);
        const expDate = stringToDate(data.expiration_date);
        return expDate >= openedDate;
      }
      return true;
    },
    {
      message: "Expiration date cannot be earlier than the date opened",
      path: ["expiration_date"],
    }
  )
  .refine(
    (data) => {
      if (data.date_opened && data.date_finished) {
        const openedDate = stringToDate(data.date_opened);
        const finishedDate = stringToDate(data.date_finished);
        return finishedDate >= openedDate;
      }
      return true;
    },
    {
      message: "Date finished cannot be earlier than the date opened",
      path: ["date_finished"],
    }
  );

type EditProductFormData = z.infer<typeof editProductSchema>;

// Date helper functions
export function dateToString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function stringToDate(dateString: string): Date {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProductFormData>({
    defaultValues: {
      brand: "",
      name: "",
      type: "",
      date_opened: "",
      date_finished: "",
      expiration_date: "",
      price: 0,
      notes: "",
      tags: [],
    },
    mode: "onChange",
  });

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);

        // Populate form with existing data
        reset({
          brand: productData.brand || "",
          name: productData.name || "",
          type: productData.type || "",
          date_opened: productData.date_opened || "",
          date_finished: productData.date_finished || "",
          expiration_date: productData.expiration_date || "",
          price: productData.price || 0,
          notes: productData.notes || "",
          tags: productData.tags || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId, reset]);

  const tags = watch("tags");
  const dateOpened = watch("date_opened");

  const addTag = () => {
    const trimmedTag = newTag.trim();

    if (!trimmedTag) {
      toast.error("Please enter a tag");
      return;
    }

    const currentTags = tags || [];

    if (
      currentTags.some((tag) => tag.toLowerCase() === trimmedTag.toLowerCase())
    ) {
      toast.error("This tag already exists");
      return;
    }

    setValue("tags", [...currentTags, trimmedTag]);
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = tags || [];
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: EditProductFormData) => {
    try {
      await updateProduct(productId, data);
      toast.success("Product updated successfully!");
      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Brand & Product Name */}
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='brand'>Brand *</Label>
                <Input
                  id='brand'
                  {...register("brand")}
                  className={errors.brand ? "border-red-500" : ""}
                />
                {errors.brand && (
                  <p className='text-xs text-red-600'>{errors.brand.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='name'>Product Name *</Label>
                <Input
                  id='name'
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className='text-xs text-red-600'>{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Product Type */}
            <div className='space-y-2'>
              <Label htmlFor='type'>Product Type *</Label>
              <Controller
                name='type'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.type ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder='Select product type' />
                    </SelectTrigger>
                    <SelectContent>
                      {ProductTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className='text-xs text-red-600'>{errors.type.message}</p>
              )}
            </div>

            {/* Dates & Price - Same as Add form */}
            <div className='grid gap-4 md:grid-cols-3'>
              {/* Date Opened */}
              <div className='space-y-2'>
                <Label>Date Opened</Label>
                <Controller
                  name='date_opened'
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(stringToDate(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='h-4 w-4' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={
                            field.value ? stringToDate(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? dateToString(date) : "")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>

              {/* Expiration Date */}
              <div className='space-y-2'>
                <Label>Expiration Date *</Label>
                <Controller
                  name='expiration_date'
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            "w-full justify-between text-left font-normal",
                            !field.value && "text-muted-foreground",
                            errors.expiration_date && "border-red-500"
                          )}
                        >
                          {field.value ? (
                            format(stringToDate(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='h-4 w-4' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0'>
                        <Calendar
                          mode='single'
                          selected={
                            field.value ? stringToDate(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date ? dateToString(date) : "")
                          }
                          disabled={(date) => {
                            if (dateOpened) {
                              return date < stringToDate(dateOpened);
                            }
                            return false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.expiration_date && (
                  <p className='text-xs text-red-600'>
                    {errors.expiration_date.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register("price", { valueAsNumber: true })}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className='text-xs text-red-600'>{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Date Finished */}
            <div className='space-y-2'>
              <Label>Date Finished (if applicable)</Label>
              <Controller
                name='date_finished'
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          "w-full justify-between text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.date_finished && "border-red-500"
                        )}
                      >
                        {field.value ? (
                          format(stringToDate(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='h-4 w-4' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value ? stringToDate(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date ? dateToString(date) : "")
                        }
                        disabled={(date) => {
                          if (dateOpened) {
                            return date < stringToDate(dateOpened);
                          }
                          return false;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date_finished && (
                <p className='text-xs text-red-600'>
                  {errors.date_finished.message}
                </p>
              )}
            </div>

            {/* Tags */}
            <div className='space-y-2'>
              <Label>Tags</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add a tag'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type='button' onClick={addTag} variant='outline'>
                  Add
                </Button>
              </div>
              {(tags || []).length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {(tags || []).map((tag, index) => (
                    <Badge
                      key={index}
                      variant='secondary'
                      className='flex items-center gap-1'
                    >
                      {tag}
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='ml-1 hover:text-red-600'
                        aria-label={`Remove ${tag} tag`}
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                placeholder='Additional notes about this product...'
                rows={3}
                {...register("notes")}
              />
            </div>

            {/* Submit Buttons */}
            <div className='flex gap-4'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
