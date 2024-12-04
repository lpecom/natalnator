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
}

export const parseCSV = (csvText: string): { headers: string[], rows: string[][] } => {
  console.log('\nStarting CSV parsing with improved validation');
  
  // Split into lines and clean up
  const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  console.log('Number of lines found:', lines.length);
  
  if (lines.length === 0) {
    console.error('No valid lines found in CSV');
    return { headers: [], rows: [] };
  }

  // Parse headers (first line)
  const headers = parseCSVLine(lines[0]);
  console.log('Headers found:', headers);

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
      console.log(`Row ${i} parsed successfully`);
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error);
    }
  }

  return { headers, rows };
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let field = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Handle escaped quotes
        field += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(field);
      field = '';
    } else {
      field += char;
    }
  }
  
  // Add the last field
  result.push(field);
  
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
      const handle = row[columnIndexes.get('Handle')!];
      const title = row[columnIndexes.get('Title')!];

      // Validate required fields
      if (!handle || !title) {
        console.error(`Row ${rowIndex + 1}: Missing required fields:`, {
          handle: !!handle,
          title: !!title
        });
        return;
      }

      // Create product object with required fields
      const product: ShopifyProduct = {
        Handle: handle,
        Title: title
      };

      // Add optional fields if they exist
      const optionalFields = [
        'Body (HTML)', 'Variant Price', 'Variant Compare At Price',
        'Image Src', 'Image Alt Text', 'Status', 'Tags', 'Vendor',
        'Type', 'Published'
      ];

      optionalFields.forEach(field => {
        const index = columnIndexes.get(field);
        if (index !== undefined && row[index]) {
          product[field as keyof ShopifyProduct] = row[index];
        }
      });

      products.push(product);
      console.log(`Successfully mapped product ${rowIndex + 1}:`, {
        handle,
        title
      });
    } catch (error) {
      console.error(`Error mapping row ${rowIndex + 1}:`, error);
    }
  });

  console.log('Total products mapped:', products.length);
  return products;
};