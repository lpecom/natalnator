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
  "Variant SKU"?: string;
  "Variant Price"?: string;
  "Variant Compare At Price"?: string;
  "Image Src"?: string;
  "Image Position"?: string;
  "Image Alt Text"?: string;
  Status?: string;
}

export const parseCSV = (csvText: string): { headers: string[], rows: string[][] } => {
  console.log('\nStarting CSV parsing');
  
  // Split the CSV text into lines, handling both \n and \r\n
  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  console.log('Total lines found:', lines.length);
  
  if (lines.length === 0) {
    console.error('No lines found in CSV');
    return { headers: [], rows: [] };
  }

  // Parse headers from first line
  const headers = parseCSVLine(lines[0]);
  console.log('Headers found:', headers);

  // Parse data rows
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const row = parseCSVLine(lines[i]);
      
      // Only add rows that have the correct number of fields
      if (row.length === headers.length) {
        rows.push(row);
      } else {
        console.error(`Row ${i + 1} has incorrect number of fields:`, {
          expected: headers.length,
          got: row.length,
          content: lines[i].substring(0, 100) + '...'
        });
      }
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error);
    }
  }

  console.log('Successfully parsed rows:', rows.length);
  return { headers, rows };
};

const parseCSVLine = (line: string): string[] => {
  const fields: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    // Handle quoted fields
    if (char === '"') {
      if (!inQuotes) {
        // Starting a quoted field
        inQuotes = true;
        i++;
        continue;
      }
      
      // Check for escaped quotes
      if (i + 1 < line.length && line[i + 1] === '"') {
        field += '"';
        i += 2;
        continue;
      }
      
      // Ending a quoted field
      inQuotes = false;
      i++;
      continue;
    }

    // Handle field separators
    if (char === ',' && !inQuotes) {
      fields.push(field.trim());
      field = '';
      i++;
      continue;
    }

    // Add character to current field
    field += char;
    i++;
  }

  // Add the last field
  fields.push(field.trim());
  return fields;
}

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nMapping rows to products');
  
  // Create a map of header names to column indices
  const headerMap = new Map<string, number>();
  headers.forEach((header, index) => {
    headerMap.set(header, index);
  });

  const products: ShopifyProduct[] = [];

  rows.forEach((row, rowIndex) => {
    try {
      const product: Partial<ShopifyProduct> = {};
      
      // Map each field from the CSV to our product object
      headerMap.forEach((columnIndex, headerName) => {
        const value = row[columnIndex];
        if (value !== undefined && value !== '') {
          (product as any)[headerName] = value;
        }
      });

      // Validate required fields
      if (!product.Handle || !product.Title) {
        console.error(`Row ${rowIndex + 1}: Missing required fields`, {
          handle: product.Handle,
          title: product.Title
        });
        return;
      }

      products.push(product as ShopifyProduct);
      console.log(`Mapped product ${rowIndex + 1}:`, {
        handle: product.Handle,
        title: product.Title
      });
    } catch (error) {
      console.error(`Error mapping row ${rowIndex + 1}:`, error);
    }
  });

  console.log('Total products mapped:', products.length);
  return products;
};