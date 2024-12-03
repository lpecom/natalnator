import { Json } from "@/integrations/supabase/types";

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
}

export interface OrderDetailsType {
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
  confirmation_date: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  status_history: StatusHistoryEntry[];
  call_center_confirmed: boolean;
  call_center_confirmed_at: string | null;
  call_center_notes: string | null;
  product?: {
    name: string;
    price: number;
    original_price: number | null;
    description_html: string | null;
  } | null;
}

export type OrderDetails = OrderDetailsType;