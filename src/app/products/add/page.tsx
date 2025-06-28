"use client";

import { useState, useEffect } from "react";
import { getAllProducts, createProduct } from "@/services/productService";

export default function ProductTest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Test fetching products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const result = await getAllProducts();

        if (result.error) {
          setError(result.error.message);
        } else {
          setProducts(result.data || []);
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Test creating a product
  const handleCreateTest = async () => {
    try {
      const testProduct = {
        brand: "Test Brand",
        name: "Test Product",
        price: 29.99,
        notes: "This is a test product",
      };

      const result = await createProduct(testProduct);

      if (result.error) {
        alert(`Error: ${result.error.message}`);
      } else {
        alert("Product created successfully!");
        // Refresh the list
        window.location.reload();
      }
    } catch (err) {
      alert("Failed to create product");
      console.error(err);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Product Test (Browser Client)</h1>

      <button
        onClick={handleCreateTest}
        className='bg-blue-500 text-white px-4 py-2 rounded mb-4'
      >
        Create Test Product
      </button>

      <div>
        <h2 className='text-xl font-semibold mb-2'>
          Products ({products.length})
        </h2>
        {products.length === 0 ? (
          <p>No products found. Try creating one!</p>
        ) : (
          <ul className='space-y-2'>
            {products.map((product: any) => (
              <li key={product.id} className='border p-2 rounded'>
                <strong>{product.brand}</strong> - {product.name}
                {product.price && <span> (${product.price})</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
