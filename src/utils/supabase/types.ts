export interface Product {
  id: string;
  brand: string;
  name: string;
  date_opened: string | null;
  date_finished: string | null;
  expiration_date: string | null;
  price: number | null;
  notes: string | null;
  tags: string[] | null;
}

export interface ProductInsert {
  brand: string;
  name: string;
  date_opened?: string | null;
  date_finished?: string | null;
  expiration_date?: string | null;
  price?: number | null;
  notes?: string | null;
  tags?: string[] | null;
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
