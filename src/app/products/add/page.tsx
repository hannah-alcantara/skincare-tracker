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
import { createProduct, deleteProduct } from "@/services/productService";
import { Product, ProductTypes } from "@/utils/supabase/types";
import { format, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";

// Converts a JS Date → "YYYY-MM-DD" for Supabase
export function dateToString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Converts "YYYY-MM-DD" → JS Date
export function stringToDate(dateString: string): Date {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export default function AddProductPage() {
  const router = useRouter();
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Product>({
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

  const tags = watch("tags");
  const dateOpened = watch("date_opened");

  const validateExpirationDate = (value: string) => {
    if (!value) return "Expiration date is required";
    console.log(value, typeof value);

    if (dateOpened && value) {
      const openedDate = stringToDate(dateOpened);
      const expDate = stringToDate(value);

      if (expDate < openedDate) {
        return "Expiration date cannot be earlier than the date opened";
      }
    }

    return true;
  };

  //ADD: validateDateFinished

  // Add later: case sensitive to prevent duplicate tags
  const addTag = () => {
    const trimmedTag = newTag.trim();

    if (!trimmedTag) return;

    const currentTags = tags || [];

    if (currentTags.includes(trimmedTag)) {
      toast.error("This tag already exists.");
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

  const onSubmit = async (data: Product) => {
    const productData: Product = {
      brand: data.brand,
      name: data.name,
      type: data.type,
      date_opened: data.date_opened || null,
      date_finished: data.date_finished || null,
      expiration_date: data.expiration_date || null,
      price: data.price || null,
      notes: data.notes || null,
      tags: data.tags || null,
    };

    try {
      await createProduct(productData);
      router.push("/products");
      router.refresh();
      toast.success("Product has been added successfully!");
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-light'>Add Product</h1>
        <p className='text-muted-background'>
          Add a new product to your collection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Brand */}
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='brand'>Brand *</Label>
                <Input
                  id='brand'
                  type='text'
                  {...register("brand", {
                    required: "Brand is required",
                  })}
                />
                {errors.brand && (
                  <p className='text-xs text-red-600'>{errors.brand.message}</p>
                )}
              </div>

              {/* Product Name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Product Name *</Label>
                <Input
                  id='name'
                  type='text'
                  {...register("name", {
                    required: "Product name is required",
                  })}
                />
                {errors.name && (
                  <p className='text-xs text-red-600'>{errors.name.message}</p>
                )}
              </div>
            </div>

            {/* Product Types */}
            <div className='space-y-2'>
              <Label htmlFor='type'>Product Type *</Label>
              <Controller
                name='type'
                control={control}
                rules={{ required: "Product type is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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

            <div className='grid gap-4 md:grid-cols-3'>
              {/* Date Opened */}
              <div className='space-y-2'>
                <Label htmlFor='dateOpened'>Date Opened </Label>
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

                          <CalendarIcon />
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
              {/* need to get date opened and not allow to go back from that date */}
              <div className='space-y-2'>
                <Label htmlFor='expirationDate'>Expiration Date *</Label>
                <Controller
                  name='expiration_date'
                  control={control}
                  rules={{
                    required: "Expiration date is required",
                    validate: validateExpirationDate,
                  }}
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
                          <CalendarIcon />
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
              {/* Remove 0 when input field is selected */}
              <div className='space-y-2'>
                <Label htmlFor='price'>Price</Label>
                <Input
                  id='price'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register("price", {
                    min: {
                      value: 0,
                      message: "Proce must be a positive number",
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            {/* Date Finished */}
            <div className='space-y-2'>
              <Label htmlFor='dateFinished'>
                Date Finished (if applicable)
              </Label>
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
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(stringToDate(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon />
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

            {/* Tags */}
            <div className='space-y-2'>
              <Label>Tags</Label>
              <div className='flex gap-2'>
                <Input
                  placeholder='Add a tag'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
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
            <div className='flex gap-4'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
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
