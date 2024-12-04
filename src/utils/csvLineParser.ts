export const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let field = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        field += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(field.trim());
      field = '';
    } else {
      field += char;
    }
  }
  
  result.push(field.trim());
  
  return result.map(f => {
    f = f.trim();
    if (f.startsWith('"') && f.endsWith('"')) {
      f = f.slice(1, -1);
    }
    return f;
  });
};