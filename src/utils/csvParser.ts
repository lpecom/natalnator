import { ParsedCSVResult, ShopifyProduct } from "../types/shopify";
import { parseCSVLine } from "./csvLineParser";

export const parseCSV = (csvText: string): ParsedCSVResult => {
  console.log('\n=== Starting CSV Parsing ===');
  
  // Split into lines but preserve newlines within quoted fields
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Handle escaped quotes
        currentLine += '""';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        insideQuotes = !insideQuotes;
        currentLine += char;
      }
    } else if (char === '\n' && !insideQuotes) {
      // Only treat as new line if we're not inside quotes
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else if (char === '\r' && nextChar === '\n' && !insideQuotes) {
      // Handle Windows-style line endings
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      i++; // Skip \n
    } else {
      currentLine += char;
    }
  }
  
  // Add the last line if there is one
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  console.log('Total number of lines (including header):', lines.length);
  
  if (lines.length === 0) {
    console.error('No valid lines found in CSV');
    return { headers: [], rows: [] };
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);
  console.log('\nHeader Analysis:');
  console.log('Number of columns:', headers.length);
  
  const requiredColumns = ['Handle', 'Title', 'Variant Price'];
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    console.error('Missing required columns:', missingColumns);
    return { headers: [], rows: [] };
  }

  // Parse data rows
  const rows: string[][] = [];
  console.log('\n=== Processing Data Rows ===');
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const row = parseCSVLine(lines[i]);
      
      if (row.length !== headers.length) {
        console.error(`Row ${i + 1} has incorrect number of fields:`, {
          expected: headers.length,
          got: row.length,
          firstFewFields: row.slice(0, 3)
        });
        continue;
      }

      rows.push(row);
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error);
    }
  }

  console.log('\n=== Parsing Complete ===');
  console.log('Successfully parsed rows:', rows.length);
  console.log('First row preview:', rows[0]?.slice(0, 3));

  return { headers, rows };
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): Record<string, string>[] => {
  console.log('\n=== Mapping Rows to Products ===');
  console.log('Number of rows to map:', rows.length);

  return rows.map((row, index) => {
    const product: Record<string, string> = {};
    
    headers.forEach((header, columnIndex) => {
      product[header] = row[columnIndex] || '';
    });

    console.log(`Mapped product ${index + 1}:`, {
      Handle: product.Handle,
      Title: product.Title,
      'Variant Price': product['Variant Price']
    });

    return product;
  });
};