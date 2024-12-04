import { ParsedCSVResult } from "../types/shopify";
import { parseCSVLine } from "./csvLineParser";

export const parseCSV = (csvText: string): ParsedCSVResult => {
  console.log('\nStarting CSV parsing');
  
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  console.log('Number of lines found:', lines.length);
  
  if (lines.length === 0) {
    console.error('No valid lines found in CSV');
    return { headers: [], rows: [] };
  }

  const headers = parseCSVLine(lines[0]);
  console.log('Headers found:', headers);
  console.log('Number of headers:', headers.length);

  const requiredColumns = ['Handle', 'Title', 'Variant Price'];
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  if (missingColumns.length > 0) {
    console.error('Missing required columns:', missingColumns);
    return { headers: [], rows: [] };
  }

  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const line = lines[i];
      if (!line.trim()) continue;

      const row = parseCSVLine(line);
      
      if (row.length !== headers.length) {
        console.error(`Row ${i + 1} has incorrect number of fields:`, {
          expected: headers.length,
          got: row.length,
          content: line.substring(0, 100) + '...'
        });
        continue;
      }

      rows.push(row);
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error);
    }
  }

  return { headers, rows };
};

export const mapRowsToProducts = (headers: string[], rows: string[][]): Record<string, string>[] => {
  console.log('\nMapping rows to products');
  
  const products: Record<string, string>[] = [];
  const requiredFields = ['Handle', 'Title', 'Variant Price'];
  
  const columnIndexes = new Map<string, number>();
  headers.forEach((header, index) => {
    columnIndexes.set(header, index);
  });

  const missingColumns = requiredFields.filter(field => !columnIndexes.has(field));
  if (missingColumns.length > 0) {
    console.error('Missing required columns:', missingColumns);
    return products;
  }

  rows.forEach((row, rowIndex) => {
    try {
      const product: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        if (row[index]) {
          product[header] = row[index];
        }
      });

      if (!product['Handle'] || !product['Title'] || !product['Variant Price']) {
        console.error(`Row ${rowIndex + 1}: Missing required fields:`, {
          handle: !!product['Handle'],
          title: !!product['Title'],
          price: !!product['Variant Price']
        });
        return;
      }

      products.push(product);
    } catch (error) {
      console.error(`Error mapping row ${rowIndex + 1}:`, error);
    }
  });

  console.log('Total products mapped:', products.length);
  return products;
};