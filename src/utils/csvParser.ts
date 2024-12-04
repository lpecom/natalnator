export interface ShopifyProduct {
  Handle: string;
  Title: string;
  "Body (HTML)"?: string;
  "Variant Price"?: string;
  "Variant Compare At Price"?: string;
  "Image Src"?: string;
  "Image Alt Text"?: string;
  "Image Position"?: string;
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
  "Option1 Name"?: string;
  "Option1 Value"?: string;
  "Variant Inventory Tracker"?: string;
  "Variant Grams"?: string;
  "Variant Image"?: string;
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
}

export const parseCSV = (csvText: string): { headers: string[], rows: string[][] } => {
  console.log('\nStarting CSV parsing with simplified approach');
  
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

  // Parse data rows
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const row = parseCSVLine(lines[i]);
      if (row.length === headers.length) {
        rows.push(row);
        console.log(`Row ${i} parsed successfully:`, {
          handle: row[headers.indexOf('Handle')],
          title: row[headers.indexOf('Title')]
        });
      } else {
        console.error(`Row ${i + 1} has incorrect number of fields:`, {
          expected: headers.length,
          got: row.length,
          rowContent: lines[i].substring(0, 100)
        });
      }
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error);
    }
  }

  return { headers, rows };
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Handle escaped quotes
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add the last field
  result.push(currentField.trim());
  return result;
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): ShopifyProduct[] => {
  console.log('\nMapping rows to products with simplified approach');
  
  const headerIndexes = new Map<string, number>();
  headers.forEach((header, index) => {
    headerIndexes.set(header, index);
  });

  const products: ShopifyProduct[] = [];

  rows.forEach((row, rowIndex) => {
    try {
      // Get required fields first
      const handle = row[headerIndexes.get('Handle') || -1];
      const title = row[headerIndexes.get('Title') || -1];

      console.log(`Mapping row ${rowIndex + 1}:`, { handle, title });

      if (!handle || !title) {
        console.error(`Row ${rowIndex + 1}: Missing required fields`, { handle, title });
        return;
      }

      const product: ShopifyProduct = {
        Handle: handle,
        Title: title,
        "Body (HTML)": row[headerIndexes.get('Body (HTML)') || -1],
        "Variant Price": row[headerIndexes.get('Variant Price') || -1],
        "Variant Compare At Price": row[headerIndexes.get('Variant Compare At Price') || -1],
        "Image Src": row[headerIndexes.get('Image Src') || -1],
        "Image Alt Text": row[headerIndexes.get('Image Alt Text') || -1],
        Status: row[headerIndexes.get('Status') || -1]
      };

      products.push(product);
      console.log(`Successfully mapped product ${rowIndex + 1}:`, {
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
