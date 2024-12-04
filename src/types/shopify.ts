export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)"?: string;
  "Variant Price": string;
  "Variant Compare At Price"?: string;
  "Image Src"?: string;
  "Image Alt Text"?: string;
  Status?: string;
  Tags?: string;
  Vendor?: string;
  Type?: string;
  Published?: string;
  "Variant SKU"?: string;
  "Product Category"?: string;
  "Gift Card"?: string;
  "Variant Weight Unit"?: string;
  "Included / Espanha"?: string;
  "Included / Brasil"?: string;
  "Included / Spain"?: string;
}

export interface ParsedCSVResult {
  headers: string[];
  rows: string[][];
}