"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Product,
  ProductTypes,
  SHELF_LIFE_SUGGESTIONS,
} from "@/utils/supabase/types";
import { format, addMonths } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/services/productService";

// Date helper functions
export function dateToString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function stringToDate(dateString: string): Date {
  return new Date(dateString);
}

// Common validation schema
const createProductSchema = (mode: "add" | "edit") => {
  const baseSchema = z.object({
    brand: z.string().min(1, "Brand is required."),
    name: z.string().min(1, "Product name is required."),
    type: z.string().min(1, "Product type is required."),
    price: z.number().min(0.0, "Price must be positive.").optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()),
  });

  if (mode === "add") {
    return baseSchema.extend({
      date_opened: z.date().optional(),
      date_finished: z.date().optional(),
      expiration_date: z.date().optional(),
    });
  } else {
    return baseSchema.extend({
      date_opened: z.string().optional(),
      date_finished: z.string().optional(),
      expiration_date: z.string().min(1, "Expiration date is required"),
    });
  }
};

// Add validation refinements
const addValidationRefinements = <T extends z.ZodTypeAny>(
  schema: T,
  mode: "add" | "edit"
) => {
  if (mode === "add") {
    return schema
      .refine(
        (data: any) => {
          return data.expiration_date != null;
        },
        {
          message: "Expiration date is required",
          path: ["expiration_date"],
        }
      )
      .refine(
        (data: any) => {
          if (data.date_opened && data.expiration_date) {
            return data.expiration_date >= data.date_opened;
          }
          return true;
        },
        {
          message: "Expiration date cannot be earlier than the date opened",
          path: ["expiration_date"],
        }
      )
      .refine(
        (data: any) => {
          if (data.date_opened && data.date_finished) {
            return data.date_finished >= data.date_opened;
          }
          return true;
        },
        {
          message: "Date finished cannot be earlier than the date opened",
          path: ["date_finished"],
        }
      );
  } else {
    return schema
      .refine(
        (data: any) => {
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
        (data: any) => {
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
  }
};

export interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: Product;
  productId?: string; // For edit mode
}

export default function ProductForm({
  mode,
  initialData,
  productId,
}: ProductFormProps) {
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Create schema with validations
  const schema = addValidationRefinements(createProductSchema(mode), mode);
  type FormData = z.infer<typeof schema>;

  // Helper function to get default values
  const getDefaultValues = (): FormData => {
    if (mode === "edit" && initialData) {
      return {
        brand: initialData.brand || "",
        name: initialData.name || "",
        type: initialData.type || "",
        date_opened: initialData.date_opened
          ? dateToString(new Date(initialData.date_opened))
          : "",
        date_finished: initialData.date_finished
          ? dateToString(new Date(initialData.date_finished))
          : "",
        expiration_date: initialData.expiration_date
          ? dateToString(new Date(initialData.expiration_date))
          : "",
        price: initialData.price || 0,
        notes: initialData.notes || "",
        tags: initialData.tags || [],
      } as FormData;
    } else {
      return {
        brand: "",
        name: "",
        type: "",
        date_opened: mode === "add" ? undefined : "",
        date_finished: mode === "add" ? undefined : "",
        expiration_date: mode === "add" ? undefined : "",
        price: 0,
        notes: "",
        tags: [],
      } as FormData;
    }
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const tags = watch("tags");
  const dateOpened = watch("date_opened");
  const selectedType = watch("type");

  // Get shelf life suggestion for selected product type
  const getShelfLifeSuggestion = (productType: string): string => {
    const months =
      SHELF_LIFE_SUGGESTIONS[
      productType as keyof typeof SHELF_LIFE_SUGGESTIONS
      ];
    if (!months) return "";
    return `Suggested shelf life: ${months} months after opening`;
  };

  // Auto-calculate expiration date based on date opened and product type
  useEffect(() => {
    if (dateOpened && selectedType && mode === "add") {
      const months = SHELF_LIFE_SUGGESTIONS[
        selectedType as keyof typeof SHELF_LIFE_SUGGESTIONS
      ];

      if (months) {
        // In add mode, dateOpened is a Date object
        const calculatedExpiration = addMonths(dateOpened as Date, months);
        setValue("expiration_date", calculatedExpiration);
      }
    }
  }, [dateOpened, selectedType, mode, setValue]);

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

  const handleFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      if (mode === "add") {
        await createProduct(data);
        toast.success("Product added successfully!");
      } else if (mode === "edit" && productId) {
        await updateProduct(productId, data);
        toast.success("Product updated successfully!");
      }

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "updating"} product:`, error);
      toast.error(`Failed to ${mode === "add" ? "add" : "update"} product. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Date picker component for both modes
  const DatePicker = ({
    field,
    label,
    required = false,
    error,
    disableBefore,
  }: {
    field: any;
    label: string;
    required?: boolean;
    error?: string;
    disableBefore?: string | Date;
  }) => {
    const getValue = () => {
      if (mode === "add") {
        return field.value;
      } else {
        return field.value ? stringToDate(field.value) : undefined;
      }
    };

    const handleSelect = (date: Date | undefined) => {
      if (mode === "add") {
        field.onChange(date);
      } else {
        field.onChange(date ? dateToString(date) : "");
      }
    };

    const getDisabledCondition = (date: Date) => {
      if (disableBefore) {
        const beforeDate =
          mode === "add" && disableBefore instanceof Date
            ? disableBefore
            : typeof disableBefore === "string"
              ? stringToDate(disableBefore)
              : disableBefore;
        return date < beforeDate;
      }
      return false;
    };

    return (
      <div className='space-y-2'>
        <Label>
          {label} {required && "*"}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                "w-full justify-between text-left font-normal",
                !field.value && "text-muted-foreground",
                error && "border-red-500"
              )}
            >
              {field.value ? (
                format(getValue()!, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={getValue()}
              onSelect={handleSelect}
              disabled={disableBefore ? getDisabledCondition : undefined}
            />
          </PopoverContent>
        </Popover>
        {error && <p className='text-xs text-red-600'>{error}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
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
              <SelectTrigger className={errors.type ? "border-red-500" : ""}>
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
        {selectedType && getShelfLifeSuggestion(selectedType) && (
          <p className='text-xs text-muted-foreground'>
            {getShelfLifeSuggestion(selectedType)}
          </p>
        )}
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {/* Date Opened */}
        <Controller
          name='date_opened'
          control={control}
          render={({ field }) => (
            <DatePicker field={field} label='Date Opened' />
          )}
        />

        {/* Expiration Date */}
        <Controller
          name='expiration_date'
          control={control}
          render={({ field }) => (
            <DatePicker
              field={field}
              label='Expiration Date'
              required={true}
              error={errors.expiration_date?.message}
              disableBefore={dateOpened}
            />
          )}
        />

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
      <Controller
        name='date_finished'
        control={control}
        render={({ field }) => (
          <DatePicker
            field={field}
            label='Date Finished (if applicable)'
            error={errors.date_finished?.message}
            disableBefore={dateOpened}
          />
        )}
      />

      {/* Tags */}
      <div className='space-y-2'>
        <Label>Tags</Label>
        <div className='flex gap-2'>
          <Input
            placeholder='Add a tag'
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
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
          {isSubmitting
            ? `${mode === "add" ? "Adding" : "Updating"} Product...`
            : `${mode === "add" ? "Add" : "Update"} Product`}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
