import { createClient } from "@/utils/supabase/client";

// Simple function to test fetching products
export async function getAllProducts() {
  const supabase = createClient();

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return { data: null, error };
  }

  console.log("Products fetched successfully:", data);
  return { data, error: null };
}

// Simple function to test creating a product
export async function createProduct(productData: {
  brand: string;
  name: string;
  price?: number;
  notes?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select();

  if (error) {
    console.error("Error creating product:", error);
    return { data: null, error };
  }

  console.log("Product created successfully:", data);
  return { data, error: null };
}
