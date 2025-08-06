export interface Product {
  id: string;
  brand: string;
  name: string;
  type: string;
  date_opened?: string | null;
  expiration_date?: string | null;
  date_finished?: string | null;
  price?: number | null;
  tags?: string[] | null;
  notes?: string | null;
}

export interface ProductUpdate {
  brand?: string;
  name?: string;
  date_opened?: string | null;
  date_finished?: string | null;
  expiration_date?: string | null;
  price?: number | null;
  notes?: string | null;
  tags?: string[] | null;
}

export interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export const ProductTypes = [
  "Cleanser",
  "Moisturizer",
  "Serum",
  "Toner",
  "Sunscreen",
  "Exfoliant",
  "Mask",
  "Eye Cream",
  "Treatment",
  "Oil",
  "Essence",
  "Ampoule",
];
