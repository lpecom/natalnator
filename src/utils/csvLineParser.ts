export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let field = '';
  let insideQuotes = false;
  let i = 0;
  
  console.log('\nParsing line length:', line.length);
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    // Handle escaped quotes inside quoted fields
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Double quotes inside a quoted field = escaped quote
        field += '"';
        i += 2; // Skip both quote characters
        continue;
      } else {
        // Toggle quote mode
        insideQuotes = !insideQuotes;
        i++;
        continue;
      }
    }
    
    // Only treat comma as field separator if we're not inside quotes
    if (char === ',' && !insideQuotes) {
      result.push(field.trim());
      field = '';
      i++;
      continue;
    }
    
    // Add character to current field
    field += char;
    i++;
  }
  
  // Add the last field
  result.push(field.trim());
  
  // Clean up the fields (remove surrounding quotes and trim)
  return result.map(f => {
    f = f.trim();
    // Remove surrounding quotes if present
    if (f.startsWith('"') && f.endsWith('"')) {
      f = f.slice(1, -1);
    }
    return f;
  });
};