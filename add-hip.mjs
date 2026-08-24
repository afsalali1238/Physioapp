import fs from 'fs'; import Papa from 'papaparse';
let areas = Papa.parse(fs.readFileSync('local-areas.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;
areas.push({ section: 'exercise', area_id: 'hip', order: 5, status: 'draft', name_en: 'Hip', name_ar: '' });
areas.push({ section: 'stretching', area_id: 'hip', order: 5, status: 'draft', name_en: 'Hip', name_ar: '' });
fs.writeFileSync('local-areas.csv', Papa.unparse(areas));

let items = Papa.parse(fs.readFileSync('local-items.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;

const newItems = [
  { id: 'str-hip-01', section: 'stretching', area_id: 'hip', order: 1, status: 'draft', name_en: 'Figure-4 Stretch', direction_en: 'Keep your lower back flat on the floor.', start_position_en: 'Lie on your back with knees bent and feet flat on the floor.', movement_en: 'Cross one ankle over the opposite knee and gently pull the bottom leg towards your chest.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Glutes, Piriformis', safety_en: 'Stop if you feel knee pain.', image_id: 'str-hip-01', image_alt_en: 'Person lying on back doing a figure-4 stretch.', type: '', return_en: '' },
  { id: 'str-hip-02', section: 'stretching', area_id: 'hip', order: 2, status: 'draft', name_en: 'Standing Hip Flexor Stretch', direction_en: 'Keep your torso upright and do not lean back.', start_position_en: 'Stand tall with one foot forward and one foot back, holding a chair for balance.', movement_en: 'Bend your front knee slightly and tuck your pelvis under until you feel a stretch in the front of your back hip.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Hip flexors', safety_en: 'Stop if you feel pinching in your lower back.', image_id: 'str-hip-02', image_alt_en: 'Person in a slight lunge stretching the front of the hip.', type: '', return_en: '' },
  { id: 'ex-hip-01', section: 'exercise', area_id: 'hip', order: 1, status: 'draft', name_en: 'Side-Lying Hip Abduction', type: 'strengthening', start_position_en: 'Lie on your side with your bottom leg bent and top leg straight.', movement_en: 'Slowly lift your top leg straight up toward the ceiling.', return_en: 'Slowly lower the leg back down.', hold_seconds: 5, reps: 10, sets: 1, each_side: true, frequency_en: 'Once a day', target_muscles_en: 'Gluteus medius', safety_en: 'Do not roll your hips backward as you lift.', image_id: 'ex-hip-01', image_alt_en: 'Person lying on side lifting top leg.', direction_en: '' },
  { id: 'ex-hip-02', section: 'exercise', area_id: 'hip', order: 2, status: 'draft', name_en: 'Clamshells', type: 'activation', start_position_en: 'Lie on your side with both knees bent and your heels together.', movement_en: 'Keep your heels touching and slowly open your top knee like a clamshell.', return_en: 'Slowly close the knee back to the start.', hold_seconds: 5, reps: 10, sets: 1, each_side: true, frequency_en: 'Once a day', target_muscles_en: 'External rotators, Glutes', safety_en: 'Do not roll your back away as you open the knee.', image_id: 'ex-hip-02', image_alt_en: 'Person lying on side opening top knee.', direction_en: '' },
  { id: 'ex-hip-03', section: 'exercise', area_id: 'hip', order: 3, status: 'draft', name_en: 'Bridging', type: 'strengthening', start_position_en: 'Lie on your back with knees bent and feet flat on the floor.', movement_en: 'Squeeze your buttocks and lift your hips off the floor until your body forms a straight line.', return_en: 'Slowly lower your hips back to the floor.', hold_seconds: 5, reps: 10, sets: 1, each_side: false, frequency_en: 'Once a day', target_muscles_en: 'Gluteus maximus', safety_en: 'Do not overarch your lower back at the top.', image_id: 'ex-hip-03', image_alt_en: 'Person lying on back lifting hips into a bridge.', direction_en: '' }
];

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

