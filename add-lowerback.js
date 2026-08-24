const fs = require('fs'); const Papa = require('papaparse');
let areas = Papa.parse(fs.readFileSync('local-areas.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;
areas.push({ section: 'exercise', area_id: 'lower-back', order: 3, status: 'draft', name_en: 'Lower Back', name_ar: '' });
areas.push({ section: 'stretching', area_id: 'lower-back', order: 3, status: 'draft', name_en: 'Lower Back', name_ar: '' });
fs.writeFileSync('local-areas.csv', Papa.unparse(areas));

let items = Papa.parse(fs.readFileSync('local-items.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;

const newItems = [
  { id: 'str-lowerback-01', section: 'stretching', area_id: 'lower-back', order: 1, status: 'draft', name_en: 'Knee to Chest', direction_en: 'Pull your knee gently towards your chest.', start_position_en: 'Lie on your back with both legs straight.', movement_en: 'Bend one knee and hold it with both hands.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Lower back, Glutes', safety_en: 'Stop if you feel a sharp pain in your groin.', image_id: 'str-lowerback-01', image_alt_en: 'Person lying on back pulling knee to chest.', type: '', return_en: '' },
  { id: 'str-lowerback-02', section: 'stretching', area_id: 'lower-back', order: 2, status: 'draft', name_en: 'Lumbar Rotation', direction_en: 'Keep your shoulders flat on the floor.', start_position_en: 'Lie on your back with knees bent and feet flat.', movement_en: 'Let both knees fall slowly to one side.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Lower back', safety_en: 'Stop if you feel pain in your lower back.', image_id: 'str-lowerback-02', image_alt_en: 'Person lying on back with knees dropped to one side.', type: '', return_en: '' },
  { id: 'ex-lowerback-01', section: 'exercise', area_id: 'lower-back', order: 1, status: 'draft', name_en: 'Pelvic Tilt', type: 'activation', start_position_en: 'Lie on your back with knees bent and feet flat.', movement_en: 'Flatten your lower back against the floor by tightening your stomach muscles.', return_en: 'Relax your stomach muscles.', hold_seconds: 5, reps: 10, sets: 1, each_side: false, frequency_en: 'Twice a day', target_muscles_en: 'Core, Lower back', safety_en: 'Breathe normally. Do not hold your breath.', image_id: 'ex-lowerback-01', image_alt_en: 'Person lying on back doing a pelvic tilt.', direction_en: '' },
  { id: 'ex-lowerback-02', section: 'exercise', area_id: 'lower-back', order: 2, status: 'draft', name_en: 'Bird Dog', type: 'strengthening', start_position_en: 'Kneel on all fours with your hands under your shoulders and knees under your hips.', movement_en: 'Straighten one arm forward and the opposite leg backward.', return_en: 'Lower your arm and leg back to the start.', hold_seconds: 5, reps: 10, sets: 1, each_side: true, frequency_en: 'Once a day', target_muscles_en: 'Core, Back extensors', safety_en: 'Keep your back straight. Do not let your lower back sag.', image_id: 'ex-lowerback-02', image_alt_en: 'Person on hands and knees raising opposite arm and leg.', direction_en: '' }
];

// Combine keys to ensure columns line up
const allKeys = new Set();
items.forEach(item => Object.keys(item).forEach(k => allKeys.add(k)));
newItems.forEach(item => Object.keys(item).forEach(k => allKeys.add(k)));
const keys = Array.from(allKeys);

const combined = [...items, ...newItems].map(item => {
  const row = {};
  keys.forEach(k => { row[k] = item[k] || ''; });
  return row;
});

fs.writeFileSync('local-items.csv', Papa.unparse(combined));

