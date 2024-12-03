import { Json } from "@/integrations/supabase/types";

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
}

export type OrderDetailsType = {
  id: string;
  customer_name: string;
  phone_number: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  order_status: string;
  variant_selections: Record<string, string> | null;
  created_at: string;
  updated_at: string;
  driver_id: string | null;
  driver_notes: string | null;
  confirmation_date: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  status_history: StatusHistoryEntry[];
  product?: {
    name: string;
    price: number;
    original_price: number | null;
    description_html: string | null;
  } | null;
  driver?: {
    name: string;
    phone_number: string;
  } | null;
}

export type OrderDetails = OrderDetailsType;