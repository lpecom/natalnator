export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  product_name?: string;
  admin_editable: boolean;
  landing_page_id?: string;
}

export interface ReviewFormData {
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  product_name?: string;
}