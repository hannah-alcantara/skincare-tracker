"use client";

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
import { cn } from "@/lib/utils";
import { createProduct } from "@/services/productService";
import { AddProduct, ProductTypes } from "@/utils/supabase/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    brand: "",
    name: "",
    type: "",
    date_opened: "",
    // date_finished: "",
    expiration_date: "",
    price: "",
    // notes: "",
    // tags: "",
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

  // Helper functions to convert between string and Date
  const stringToDate = (dateString: string): Date | undefined => {
    return dateString ? new Date(dateString) : undefined;
  };

  const dateToString = (date: Date | undefined): string => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: AddProduct = {
      brand: formData.brand,
      name: formData.name,
      type: formData.type,
      date_opened: formData.date_opened || null,
      // date_finished: formData.date_finished || null,
      // expiration_date: formData.expiration_date,
      price: formData.price ? parseFloat(formData.price) : null,
      // notes: formData.notes || null,
      // tags: formData.tags
      //   ? formData.tags.split(",").map((tag) => tag.trim())
      //   : null,
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
                        "w-[240px] pl-3 justify-between text-left font-normal",
                        !formData.date_opened && "text-muted-foreground"
                      )}
                    >
                      {formData.date_opened ? (
                        format(stringToDate(formData.date_opened)!, "PPP")
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
                          date_opened: dateToString(date),
                        }))
                      }
                      // autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {/* <div className='space-y-2'>
                <Label htmlFor='expirationDate'>Expiration Date *</Label>
                <Input
                  id='expirationDate'
                  name='expirationDate'
                  type='date'
                  value={formData.expiration_date}
                  onChange={handleInputChange}
                  required
                />
              </div> */}

              {/* Price */}
              {/* <div className='space-y-2'>
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
              </div> */}
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
