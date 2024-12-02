export interface ProductData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
}

export interface ScrapingResult {
  success: boolean;
  data?: ProductData;
  error?: string;
}