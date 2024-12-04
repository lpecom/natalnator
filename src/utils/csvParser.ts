export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)": string;
  "Variant Price": string;
  "Variant Compare At Price": string;
  "Image Src": string;
  "Image Alt Text": string;
  "Option1 Name": string;
  "Option1 Value": string;
  "Option2 Name": string;
  "Option2 Value": string;
  Status: string;
}

export const parseCSV = (text: string): { headers: string[], rows: string[][] } => {
  console.log('Starting CSV parsing');
  console.log('Raw text length:', text.length);
  
  // Split by newlines and filter empty lines
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  console.log('Total lines found (including header):', lines.length);
  
  // Parse headers
  const headers = lines[0].split(',').map(header => {
    const cleaned = header.trim().replace(/^"/, '').replace(/"$/, '');
    console.log('Found header:', cleaned);
    return cleaned;
  });
  
  // Parse rows with detailed logging
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    console.log(`\nProcessing line ${i}:`);
    console.log('Raw line:', line);
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (line[j + 1] === '"') {
          // Handle escaped quotes
          currentValue += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue.trim());
        console.log(`Column value:`, currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    // Push the last value
    row.push(currentValue.trim());
    console.log(`Final column value:`, currentValue.trim());
    
    if (row.length !== headers.length) {
      console.warn(`Row ${i} has ${row.length} columns but headers has ${headers.length} columns`);
      console.warn('Row data:', row);
    }
    
    rows.push(row);
  }

  console.log('\nParsing summary:');
  console.log('Total valid rows:', rows.length);
  console.log('Headers count:', headers.length);
  
  return { headers, rows };
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nStarting product mapping');
  const products: ShopifyProduct[] = [];
  
  rows.forEach((values, index) => {
    console.log(`\nMapping product ${index + 1}:`);
    const product = headers.reduce((obj: any, header, i) => {
      obj[header] = values[i] || '';
      console.log(`${header}: ${values[i] || '(empty)'}`);
      return obj;
    }, {});
    
    // Validate required fields
    if (!product.Title || !product["Variant Price"]) {
      console.warn(`Product ${index + 1} missing required fields:`, {
        hasTitle: !!product.Title,
        hasPrice: !!product["Variant Price"]
      });
    }
    
    products.push(product as ShopifyProduct);
  });
  
  console.log('\nProduct mapping complete');
  console.log('Total products mapped:', products.length);
  
  return products;
};