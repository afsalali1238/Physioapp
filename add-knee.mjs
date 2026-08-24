import fs from 'fs'; import Papa from 'papaparse';
let areas = Papa.parse(fs.readFileSync('local-areas.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;
areas.push({ section: 'exercise', area_id: 'knee', order: 4, status: 'draft', name_en: 'Knee', name_ar: '' });
areas.push({ section: 'stretching', area_id: 'knee', order: 4, status: 'draft', name_en: 'Knee', name_ar: '' });
fs.writeFileSync('local-areas.csv', Papa.unparse(areas));

let items = Papa.parse(fs.readFileSync('local-items.csv', 'utf8'), {header: true, skipEmptyLines: true}).data;

const newItems = [
  { id: 'str-knee-01', section: 'stretching', area_id: 'knee', order: 1, status: 'draft', name_en: 'Standing Quad Stretch', direction_en: 'Keep your knees close together and your back straight.', start_position_en: 'Stand straight and hold onto a chair or wall for balance.', movement_en: 'Bend one knee and hold your ankle, pulling your heel towards your buttocks.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Quadriceps', safety_en: 'Stop if you feel a sharp pain in your knee joint.', image_id: 'str-knee-01', image_alt_en: 'Person standing pulling ankle back.', type: '', return_en: '' },
  { id: 'str-knee-02', section: 'stretching', area_id: 'knee', order: 2, status: 'draft', name_en: 'Seated Hamstring Stretch', direction_en: 'Keep your back straight and hinge from your hips.', start_position_en: 'Sit on the edge of a chair with one leg straight in front of you, heel on the floor.', movement_en: 'Lean forward slightly until you feel a stretch in the back of your straight leg.', hold_seconds: 30, reps: 3, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Hamstrings', safety_en: 'Stop if you feel a pulling behind your knee.', image_id: 'str-knee-02', image_alt_en: 'Person seated leaning forward with one leg straight.', type: '', return_en: '' },
  { id: 'ex-knee-01', section: 'exercise', area_id: 'knee', order: 1, status: 'draft', name_en: 'Straight Leg Raise', type: 'activation', start_position_en: 'Lie on your back with one knee bent and the other straight.', movement_en: 'Tighten the thigh muscle of your straight leg and lift it to the height of your bent knee.', return_en: 'Slowly lower the leg back to the floor.', hold_seconds: 5, reps: 10, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Quadriceps, Core', safety_en: 'Do not arch your lower back.', image_id: 'ex-knee-01', image_alt_en: 'Person lying on back lifting straight leg.', direction_en: '' },
  { id: 'ex-knee-02', section: 'exercise', area_id: 'knee', order: 2, status: 'draft', name_en: 'Short Arc Quad', type: 'strengthening', start_position_en: 'Lie on your back or sit with a rolled towel under your knee.', movement_en: 'Straighten your knee fully by tightening your thigh muscle.', return_en: 'Slowly lower your heel back to the resting position.', hold_seconds: 5, reps: 10, sets: 1, each_side: true, frequency_en: 'Twice a day', target_muscles_en: 'Quadriceps (VMO)', safety_en: 'Keep the back of your knee firmly against the towel.', image_id: 'ex-knee-02', image_alt_en: 'Person straightening knee over a rolled towel.', direction_en: '' },
  { id: 'ex-knee-03', section: 'exercise', area_id: 'knee', order: 3, status: 'draft', name_en: 'Wall Slide', type: 'strengthening', start_position_en: 'Stand with your back against a wall and feet shoulder-width apart.', movement_en: 'Slowly slide down the wall until your knees are bent to a 45-degree angle.', return_en: 'Push through your heels to slide back up to a standing position.', hold_seconds: 5, reps: 10, sets: 1, each_side: false, frequency_en: 'Once a day', target_muscles_en: 'Quadriceps, Glutes', safety_en: 'Do not let your knees go past your toes.', image_id: 'ex-knee-03', image_alt_en: 'Person leaning against wall with knees bent.', direction_en: '' }
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

