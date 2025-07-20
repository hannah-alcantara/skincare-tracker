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
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createProduct } from "@/services/productService";
import { AddProduct, ProductTypes } from "@/utils/supabase/types";
import { format, parse } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    type: "",
    date_opened: "",
    date_finished: "",
    expiration_date: "",
    price: "",
    notes: "",
    tags: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(value);
  };

  const handleTypeChange = (type: string) => {
    //add expiration date suggestion
    setFormData((prev) => ({ ...prev, type }));
  };

  // Add later: case sensitive to prevent duplicate tags
  const addTag = () => {
    const trimmedTag = newTag.trim();

    if (!trimmedTag) return;

    if (formData.tags.includes(trimmedTag)) {
      toast.error("This tag already exists.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmedTag],
    }));

    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: AddProduct = {
      brand: formData.brand,
      name: formData.name,
      type: formData.type,
      date_opened: formData.date_opened || null,
      date_finished: formData.date_finished || null,
      expiration_date: formData.expiration_date || null,
      price: formData.price ? parseFloat(formData.price) : null,
      notes: formData.notes || null,
      tags: formData.tags,
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
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='brand'>Brand *</Label>
                <Input
                  id='brand'
                  name='brand'
                  type='text'
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                ></Input>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='name'>Product Name *</Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                ></Input>
              </div>
            </div>

            {/* Product Types */}
            <div className='space-y-2'>
              <Label htmlFor='type'>Product Type *</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
                required
              >
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
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              {/* Date Opened */}
              <div className='space-y-2'>
                <Label htmlFor='dateOpened'>Date Opened </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        "w-full justify-between text-left font-normal",
                        !formData.date_opened && "text-muted-foreground"
                      )}
                    >
                      {formData.date_opened ? (
                        format(stringToDate(formData.date_opened), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}

                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          date_opened: date ? dateToString(date) : "",
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* need to get date opened and not allow to go back from that date */}
              <div className='space-y-2'>
                <Label htmlFor='expirationDate'>Expiration Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className={cn(
                        "w-full justify-between text-left font-normal",
                        !formData.expiration_date && "text-muted-foreground"
                      )}
                    >
                      {formData.expiration_date ? (
                        format(stringToDate(formData.expiration_date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      onSelect={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          expiration_date: date ? dateToString(date) : "",
                        }))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Price */}
              <div className='space-y-2'>
                <Label htmlFor='price'>Price *</Label>
                <Input
                  id='price'
                  name='price'
                  type='number'
                  step='0.01'
                  min='0'
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                ></Input>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='dateFinished'>
                Date Finished (if applicable) *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      "w-full justify-between text-left font-normal",
                      !formData.date_finished && "text-muted-foreground"
                    )}
                  >
                    {formData.date_finished ? (
                      format(stringToDate(formData.date_finished), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        date_finished: date ? dateToString(date) : "",
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

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
              {formData.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {formData.tags.map((tag, index) => (
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

            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                placeholder='Additional notes about this product...'
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div className='flex gap-4'>
              <Button type='submit'>Add Product</Button>
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
