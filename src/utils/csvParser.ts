export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)": string;
  "Variant Price": string;
  "Variant Compare At Price": string;
  "Image Src": string;
  "Image Alt Text": string;
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
  const headers = lines[0].split(',').map(header => {
    return header.trim().replace(/^"/, '').replace(/"$/, '');
  });
  
  console.log('Headers found:', headers);
  
  // Parse rows
  const rows: string[][] = [];
  
  // Start from line 1 (skip headers)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    console.log(`Processing line ${i}:`, line);
    
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
      console.log('Row processed successfully:', {
        handle: values[headers.indexOf('Handle')],
        title: values[headers.indexOf('Title')],
        price: values[headers.indexOf('Variant Price')]
      });
    } else {
      console.warn(`Row ${i} has incorrect number of fields. Expected ${headers.length}, got ${values.length}`);
    }
  }
  
  console.log('\nParsing complete');
  console.log('Total valid rows:', rows.length);
  return { headers, rows };
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nMapping rows to products');
  console.log('Headers:', headers);
  
  const products: ShopifyProduct[] = [];
  const requiredFields = ['Handle', 'Title', 'Variant Price'];
  
  rows.forEach((row, index) => {
    const product: any = {};
    let hasAllRequiredFields = true;
    
    headers.forEach((header, colIndex) => {
      // Only map fields we care about
      if (['Handle', 'Title', 'Body (HTML)', 'Variant Price', 'Variant Compare At Price', 'Image Src', 'Image Alt Text'].includes(header)) {
        const value = row[colIndex] || '';
        product[header] = value;
        
        if (requiredFields.includes(header) && !value) {
          hasAllRequiredFields = false;
          console.warn(`Row ${index + 1}: Missing required field "${header}"`);
        }
      }
    });
    
    if (hasAllRequiredFields) {
      products.push(product as ShopifyProduct);
      console.log(`Product ${index + 1} mapped successfully:`, {
        handle: product.Handle,
        title: product.Title,
        hasDescription: !!product['Body (HTML)']
      });
    } else {
      console.warn(`Row ${index + 1}: Skipped due to missing required fields`);
    }
  });
  
  console.log('\nProduct mapping complete');
  console.log('Total products mapped:', products.length);
  
  return products;
};