export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)"?: string;
  Vendor?: string;
  "Product Category"?: string;
  Type?: string;
  Tags?: string;
  Published?: string;
  "Option1 Name"?: string;
  "Option1 Value"?: string;
  "Option2 Name"?: string;
  "Option2 Value"?: string;
  "Option3 Name"?: string;
  "Option3 Value"?: string;
  "Variant SKU"?: string;
  "Variant Grams"?: string;
  "Variant Inventory Tracker"?: string;
  "Variant Inventory Policy"?: string;
  "Variant Fulfillment Service"?: string;
  "Variant Price"?: string;
  "Variant Compare At Price"?: string;
  "Variant Requires Shipping"?: string;
  "Variant Taxable"?: string;
  "Variant Barcode"?: string;
  "Image Src"?: string;
  "Image Position"?: string;
  "Image Alt Text"?: string;
  "Gift Card"?: string;
  "SEO Title"?: string;
  "SEO Description"?: string;
  "Google Shopping / Google Product Category"?: string;
  "Google Shopping / Gender"?: string;
  "Google Shopping / Age Group"?: string;
  "Google Shopping / MPN"?: string;
  "Google Shopping / Condition"?: string;
  "Google Shopping / Custom Product"?: string;
  "Google Shopping / Custom Label 0"?: string;
  "Google Shopping / Custom Label 1"?: string;
  "Google Shopping / Custom Label 2"?: string;
  "Google Shopping / Custom Label 3"?: string;
  "Google Shopping / Custom Label 4"?: string;
  "Variant Image"?: string;
  "Variant Weight Unit"?: string;
  "Variant Tax Code"?: string;
  "Cost per item"?: string;
  "Included / Espanha"?: string;
  "Price / Espanha"?: string;
  "Compare At Price / Espanha"?: string;
  "Included / Brasil"?: string;
  "Price / Brasil"?: string;
  "Compare At Price / Brasil"?: string;
  "Included / Spain"?: string;
  "Price / Spain"?: string;
  "Compare At Price / Spain"?: string;
  Status?: string;
}

export const parseCSV = (text: string): { headers: string[], rows: string[][] } => {
  console.log('\nStarting CSV parsing');
  console.log('Raw CSV content:', text.substring(0, 500)); // Log first 500 chars
  
  // Split by newlines and filter empty lines
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  console.log('Total lines found:', lines.length);
  
  if (lines.length === 0) {
    console.error('No lines found in CSV');
    return { headers: [], rows: [] };
  }
  
  // Parse headers - first line
  const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, ''));
  console.log('Headers found:', headers);
  
  // Parse rows
  const rows: string[][] = [];
  
  // Start from line 1 (skip headers)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        if (insideQuotes && line[j + 1] === '"') {
          // Handle escaped quotes
          currentValue += '"';
          j++; // Skip next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // End of field
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add the last field
    values.push(currentValue.trim());
    
    if (values.length === headers.length) {
      rows.push(values);
    } else {
      console.warn(`Row ${i} has incorrect number of fields. Expected ${headers.length}, got ${values.length}`);
      console.log('Row content:', line);
      console.log('Parsed values:', values);
    }
  }
  
  console.log('\nParsing complete');
  console.log('Total rows parsed:', rows.length);
  return { headers, rows };
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nMapping rows to products');
  console.log('Headers to map:', headers);
  
  const products: ShopifyProduct[] = [];
  const headerIndexMap = new Map<string, number>();
  
  headers.forEach((header, index) => {
    headerIndexMap.set(header.replace(/^"|"$/g, ''), index);
  });
  
  console.log('Header mapping:', Object.fromEntries(headerIndexMap));
  
  rows.forEach((row, rowIndex) => {
    const product: Partial<ShopifyProduct> = {};
    let hasRequiredFields = true;
    
    for (const [field, index] of headerIndexMap) {
      const value = row[index]?.replace(/^"|"$/g, '').trim() || '';
      
      if ((field === 'Handle' || field === 'Title') && !value) {
        console.warn(`Row ${rowIndex + 1}: Missing required field "${field}"`);
        hasRequiredFields = false;
        break;
      }
      
      (product as any)[field] = value;
    }
    
    if (hasRequiredFields) {
      products.push(product as ShopifyProduct);
      console.log(`Row ${rowIndex + 1} mapped successfully:`, {
        handle: product.Handle,
        title: product.Title
      });
    }
  });
  
  console.log('Total products mapped:', products.length);
  return products;
};