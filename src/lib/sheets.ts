import Papa from 'papaparse';
import { areaSchema, itemSchema } from './schemas';

export async function fetchCsv(sheetId: string, sheetName: string) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&sheet=${sheetName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${sheetName}: ${response.statusText}`);
  }
  return await response.text();
}

export function parseAndClean(csv: string) {
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
  return parsed.data.map((row: any) => {
    const cleanRow: any = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === undefined || value === null) {
        cleanRow[key] = undefined;
        continue;
      }
      let val = String(value).trim();
      if (val === '') {
        cleanRow[key] = undefined;
      } else if (val.toUpperCase() === 'TRUE') {
        cleanRow[key] = true;
      } else if (val.toUpperCase() === 'FALSE') {
        cleanRow[key] = false;
      } else if (!isNaN(Number(val))) {
        cleanRow[key] = Number(val);
      } else {
        cleanRow[key] = val;
      }
    }
    return cleanRow;
  });
}

export async function getPreviewData(sheetId: string) {
  const areasCsv = await fetchCsv(sheetId, 'areas');
  const itemsCsv = await fetchCsv(sheetId, 'items');
  
  const areasData = parseAndClean(areasCsv).map(area => ({
    ...area,
    id: area.section && area.area_id ? `${area.section}-${area.area_id}` : undefined
  }));
  const itemsData = parseAndClean(itemsCsv);
  
  const areas = areasData
    .map(row => areaSchema.safeParse(row))
    .filter(res => res.success)
    .map(res => (res as any).data)
    .filter(a => a.status === 'published' || a.status === 'draft');
    
  const items = itemsData
    .map(row => itemSchema.safeParse(row))
    .filter(res => res.success)
    .map(res => (res as any).data)
    .filter(i => i.status === 'published' || i.status === 'draft');
  
  return { areas, items };
}
