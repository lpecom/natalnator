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
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  // Start from line 1 (skip headers)
  for (let lineIndex = 1; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    currentRow = [];
    currentField = '';
    insideQuotes = false;
    
    console.log(`\nProcessing line ${lineIndex}:`, line);
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          // Handle escaped quotes
          currentField += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // End of field
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // Add the last field
    currentRow.push(currentField.trim());
    
    if (currentRow.length === headers.length) {
      rows.push(currentRow);
      console.log('Row processed:', currentRow);
    } else {
      console.warn(`Skipping row ${lineIndex} - column count mismatch. Expected ${headers.length}, got ${currentRow.length}`);
      console.warn('Row data:', currentRow);
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
  const requiredFields = ['Title', 'Variant Price'];
  
  rows.forEach((row, index) => {
    const product: any = {};
    let hasAllRequiredFields = true;
    
    headers.forEach((header, colIndex) => {
      const value = row[colIndex] || '';
      product[header] = value;
      
      if (requiredFields.includes(header) && !value) {
        hasAllRequiredFields = false;
        console.warn(`Row ${index + 1}: Missing required field "${header}"`);
      }
    });
    
    if (hasAllRequiredFields) {
      products.push(product as ShopifyProduct);
      console.log(`Product ${index + 1} mapped:`, {
        title: product.Title,
        price: product['Variant Price'],
        handle: product.Handle
      });
    } else {
      console.warn(`Row ${index + 1}: Skipped due to missing required fields`);
    }
  });
  
  console.log('\nProduct mapping complete');
  console.log('Total products mapped:', products.length);
  
  return products;
};