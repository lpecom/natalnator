export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)"?: string;
  "Variant Price"?: string;
  "Image Src"?: string;
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
    }
  }
  
  console.log('\nParsing complete');
  console.log('Total rows parsed:', rows.length);
  return { headers, rows };
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nMapping rows to products');
  
  const products: ShopifyProduct[] = [];
  const headerIndexMap = new Map<string, number>();
  
  // Create a map of required field names to their column indices
  headers.forEach((header, index) => {
    headerIndexMap.set(header.replace(/^"|"$/g, ''), index);
  });
  
  console.log('Header mapping:', Object.fromEntries(headerIndexMap));
  
  rows.forEach((row, rowIndex) => {
    const product: Partial<ShopifyProduct> = {};
    let hasRequiredFields = true;
    
    // Map only the fields we need
    for (const [field, index] of headerIndexMap) {
      if (field === 'Handle' || field === 'Title' || field === 'Body (HTML)' || 
          field === 'Variant Price' || field === 'Image Src') {
        const value = row[index]?.replace(/^"|"$/g, '').trim() || '';
        
        if ((field === 'Handle' || field === 'Title') && !value) {
          console.warn(`Row ${rowIndex + 1}: Missing required field "${field}"`);
          hasRequiredFields = false;
          break;
        }
        
        product[field as keyof ShopifyProduct] = value;
      }
    }
    
    if (hasRequiredFields) {
      products.push(product as ShopifyProduct);
      console.log(`Row ${rowIndex + 1} mapped successfully:`, {
        handle: product.Handle,
        title: product.Title
      });
    }
  });
  
  console.log('\nProduct mapping complete');
  console.log('Total valid products:', products.length);
  
  return products;
};