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
  
  // Split by newlines and filter empty lines
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  console.log('Total lines found:', lines.length);
  
  if (lines.length === 0) {
    console.error('No lines found in CSV');
    return { headers: [], rows: [] };
  }
  
  // Parse headers - first line
  const headers = parseCSVLine(lines[0]);
  console.log('Headers found:', headers);
  
  // Parse rows
  const rows: string[][] = [];
  
  // Start from line 1 (skip headers)
  for (let i = 1; i < lines.length; i++) {
    const parsedLine = parseCSVLine(lines[i]);
    
    if (parsedLine.length === headers.length) {
      rows.push(parsedLine);
    } else {
      console.warn(`Row ${i + 1} has incorrect number of fields. Expected ${headers.length}, got ${parsedLine.length}`);
      console.log('Row content:', lines[i]);
      console.log('Parsed values:', parsedLine);
    }
  }
  
  console.log('\nParsing complete');
  console.log('Total rows parsed:', rows.length);
  return { headers, rows };
};

const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Handle escaped quotes ("") inside quoted fields
        currentValue += '"';
        i += 2; // Skip both quotes
        continue;
      }
      insideQuotes = !insideQuotes;
      i++;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      // End of field
      values.push(currentValue.trim());
      currentValue = '';
      i++;
      continue;
    }

    currentValue += char;
    i++;
  }

  // Add the last field
  values.push(currentValue.trim());
  
  // Clean up any remaining quotes at the start/end of fields
  return values.map(value => value.replace(/^"|"$/g, ''));
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
      const value = row[index] || '';
      
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