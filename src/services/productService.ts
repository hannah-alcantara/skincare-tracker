import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/supabase/types";

const supabase = createClient();

// Simple function to test fetching products
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data;
}

export async function createProduct(productData: Product) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data;
}

export async function deleteProduct(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .select();

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return data;
}

export async function editProduct(productId: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update product: ${error.message}')
  }

  return data;
}