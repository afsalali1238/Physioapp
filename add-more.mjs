import fs from 'fs'; import Papa from 'papaparse';
let areas = Papa.parse(fs.readFileSync('local-areas.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;
const newAreas = [
  { section: 'exercise', area_id: 'ankle', order: 6, status: 'draft', name_en: 'Ankle', name_ar: '' },
  { section: 'stretching', area_id: 'ankle', order: 6, status: 'draft', name_en: 'Ankle', name_ar: '' },
  { section: 'exercise', area_id: 'wrist', order: 7, status: 'draft', name_en: 'Wrist', name_ar: '' },
  { section: 'stretching', area_id: 'wrist', order: 7, status: 'draft', name_en: 'Wrist', name_ar: '' },
  { section: 'exercise', area_id: 'elbow', order: 8, status: 'draft', name_en: 'Elbow', name_ar: '' },
  { section: 'stretching', area_id: 'elbow', order: 8, status: 'draft', name_en: 'Elbow', name_ar: '' }
];
areas.push(...newAreas);
fs.writeFileSync('local-areas.csv', Papa.unparse(areas));

let items = Papa.parse(fs.readFileSync('local-items.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;

const newItems = [
  // Ankle
  { id: 'str-ankle-01', section: 'stretching', area_id: 'ankle', order: 1, status: 'draft', name_en: 'Calf Stretch against Wall', direction_en: 'Keep your back heel flat on the floor.', start_position_en: 'Stand facing a wall with one foot back and both hands on the wall.', movement_en: 'Lean forward and bend your front knee until you feel a stretch in your back calf.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Gastrocnemius', safety_en: 'Stop if you feel a sharp pain in your Achilles tendon.', image_id: 'str-ankle-01', image_alt_en: 'Person leaning against wall stretching back calf.', type: '', return_en: '' },
  { id: 'ex-ankle-01', section: 'exercise', area_id: 'ankle', order: 1, status: 'draft', name_en: 'Ankle Pumps', type: 'mobility', start_position_en: 'Sit or lie down with your legs straight.', movement_en: 'Point your toes away from you as far as comfortable, then pull them back towards you.', return_en: 'Return to a neutral position.', hold_seconds: 0, reps: 15, sets: 2, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Calves, Shin muscles', safety_en: 'Move slowly and smoothly.', image_id: 'ex-ankle-01', image_alt_en: 'Close up of foot pointing and flexing.', direction_en: '' },
  { id: 'ex-ankle-02', section: 'exercise', area_id: 'ankle', order: 2, status: 'draft', name_en: 'Heel Raises', type: 'strengthening', start_position_en: 'Stand straight and hold onto a chair or counter for balance.', movement_en: 'Slowly lift both heels off the floor to stand on your toes.', return_en: 'Slowly lower your heels back to the floor.', hold_seconds: 2, reps: 10, sets: 2, each_side: false, frequency_en: 'Once a day', target_muscles_en: 'Calves', safety_en: 'Do not bounce. Move slowly.', image_id: 'ex-ankle-02', image_alt_en: 'Person standing holding a chair and raising heels.', direction_en: '' },
  
  // Wrist
  { id: 'str-wrist-01', section: 'stretching', area_id: 'wrist', order: 1, status: 'draft', name_en: 'Wrist Flexor Stretch', direction_en: 'Keep your elbow straight.', start_position_en: 'Extend one arm straight out in front of you with the palm facing up.', movement_en: 'Use your other hand to gently pull your fingers down towards the floor.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Wrist flexors', safety_en: 'Do not force the stretch.', image_id: 'str-wrist-01', image_alt_en: 'Person stretching wrist with fingers pointing down.', type: '', return_en: '' },
  { id: 'ex-wrist-01', section: 'exercise', area_id: 'wrist', order: 1, status: 'draft', name_en: 'Wrist Flexion', type: 'strengthening', start_position_en: 'Rest your forearm on a table with your wrist hanging off the edge, holding a light weight palm up.', movement_en: 'Slowly curl your wrist upward.', return_en: 'Slowly lower your wrist back down.', hold_seconds: 2, reps: 10, sets: 2, each_side: true, frequency_en: 'Once a day', target_muscles_en: 'Wrist flexors', safety_en: 'Keep your forearm flat on the table.', image_id: 'ex-wrist-01', image_alt_en: 'Person curling wrist holding a small weight.', direction_en: '' },
  
  // Elbow
  { id: 'str-elbow-01', section: 'stretching', area_id: 'elbow', order: 1, status: 'draft', name_en: 'Triceps Stretch', direction_en: 'Keep your head up and do not push your neck forward.', start_position_en: 'Sit or stand upright.', movement_en: 'Raise one arm, bend the elbow to reach behind your neck, and use your other hand to gently push the elbow backward.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Triceps', safety_en: 'Stop if you feel shoulder pain.', image_id: 'str-elbow-01', image_alt_en: 'Person stretching triceps overhead.', type: '', return_en: '' },
  { id: 'ex-elbow-01', section: 'exercise', area_id: 'elbow', order: 1, status: 'draft', name_en: 'Elbow Flexion', type: 'mobility', start_position_en: 'Sit or stand with your arm hanging by your side, palm facing forward.', movement_en: 'Slowly bend your elbow to bring your hand towards your shoulder.', return_en: 'Slowly lower your hand back to the start.', hold_seconds: 2, reps: 10, sets: 2, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Biceps', safety_en: 'Move only your elbow. Keep your shoulder still.', image_id: 'ex-elbow-01', image_alt_en: 'Person bending elbow with palm forward.', direction_en: '' }
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

