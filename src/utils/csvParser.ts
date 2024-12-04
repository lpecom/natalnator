export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)"?: string;
  "Variant Price"?: string;
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
  "Variant Inventory Policy"?: string;
  "Variant Fulfillment Service"?: string;
  "Variant Requires Shipping"?: string;
  "Variant Taxable"?: string;
  "Variant Barcode"?: string;
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
  "Variant Grams"?: string;
  "Variant Weight Unit"?: string;
  "Variant Tax Code"?: string;
  "Cost per item"?: string;
}

export const parseCSV = (csvText: string): { headers: string[], rows: string[][] } => {
  console.log('\nStarting CSV parsing with improved validation');
  
  // Split into lines, preserving newlines within quotes
  const lines = splitCSVLines(csvText);
  console.log('Number of lines found:', lines.length);
  
  if (lines.length === 0) {
    console.error('No valid lines found in CSV');
    return { headers: [], rows: [] };
  }

  // Parse headers (first line)
  const headers = parseCSVLine(lines[0]);
  console.log('Headers found:', headers);
  console.log('Number of headers:', headers.length);

  // Validate required columns
  const requiredColumns = ['Handle', 'Title'];
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    console.error('Missing required columns:', missingColumns);
    return { headers: [], rows: [] };
  }

  // Parse data rows with validation
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const line = lines[i];
      if (!line.trim()) {
        console.log(`Skipping empty line ${i + 1}`);
        continue;
      }

      const row = parseCSVLine(line);
      
      // Validate row length
      if (row.length !== headers.length) {
        console.error(`Row ${i + 1} has incorrect number of fields:`, {
          expected: headers.length,
          got: row.length,
          content: line.substring(0, 100) + '...'
        });
        continue;
      }

      rows.push(row);
      if (i === 1 || i % 100 === 0) {
        console.log(`Parsed row ${i} successfully`);
      }
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error);
    }
  }

  return { headers, rows };
};

const splitCSVLines = (text: string): string[] => {
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (nextChar === '"') {
        // Handle escaped quotes
        currentLine += char;
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
        currentLine += char;
      }
    } else if (char === '\n' && !insideQuotes) {
      // End of line outside quotes
      lines.push(currentLine);
      currentLine = '';
    } else if (char === '\r' && nextChar === '\n' && !insideQuotes) {
      // Handle Windows-style line endings
      lines.push(currentLine);
      currentLine = '';
      i++; // Skip \n
    } else {
      currentLine += char;
    }
  }
  
  // Add the last line if it exists
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let field = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Handle escaped quotes
        field += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(field.trim());
      field = '';
    } else {
      field += char;
    }
  }
  
  // Add the last field
  result.push(field.trim());
  
  // Clean up fields
  return result.map(f => {
    f = f.trim();
    // Remove surrounding quotes if present
    if (f.startsWith('"') && f.endsWith('"')) {
      f = f.slice(1, -1);
    }
    return f;
  });
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nMapping rows to products with validation');
  
  const products: ShopifyProduct[] = [];
  const requiredFields = ['Handle', 'Title'];
  
  // Create a map of column indexes
  const columnIndexes = new Map<string, number>();
  headers.forEach((header, index) => {
    columnIndexes.set(header, index);
  });

  // Validate required columns exist
  const missingColumns = requiredFields.filter(field => !columnIndexes.has(field));
  if (missingColumns.length > 0) {
    console.error('Missing required columns:', missingColumns);
    return products;
  }

  rows.forEach((row, rowIndex) => {
    try {
      const product: ShopifyProduct = {} as ShopifyProduct;
      
      // Map each header to its corresponding value
      headers.forEach((header, index) => {
        if (row[index]) {
          (product as any)[header] = row[index];
        }
      });

      // Validate required fields
      if (!product.Handle || !product.Title) {
        console.error(`Row ${rowIndex + 1}: Missing required fields:`, {
          handle: !!product.Handle,
          title: !!product.Title
        });
        return;
      }

      products.push(product);
      if (rowIndex === 0 || rowIndex % 100 === 0) {
        console.log(`Successfully mapped product ${rowIndex + 1}:`, {
          handle: product.Handle,
          title: product.Title
        });
      }
    } catch (error) {
      console.error(`Error mapping row ${rowIndex + 1}:`, error);
    }
  });

  console.log('Total products mapped:', products.length);
  return products;
};