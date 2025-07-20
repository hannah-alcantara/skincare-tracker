import { createClient } from "@/utils/supabase/client";
import { Product, AddProduct } from "@/utils/supabase/types";

const supabase = createClient();

// Simple function to test fetching products
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return data;
}

export async function createProduct(productData: AddProduct) {
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
