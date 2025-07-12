import { createClient } from "@/utils/supabase/client";
import { Product, AddProduct } from "@/utils/supabase/types";

const supabase = createClient();

// Simple function to test fetching products
export async function getAllProducts() {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return { data: null, error };
  }

  console.log("Products fetched successfully:", data);
  return { data, error: null };
}

export async function createProduct(productData: AddProduct): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  console.log("Product created successfully:", data);
  return data;
}
