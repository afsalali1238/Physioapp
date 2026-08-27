import { assertValidEducationEntries } from '../../lib/anatomy/education-validation';

export type EducationStatus = 'draft' | 'published' | 'retired';

export type EducationEntry = {
  id: string;
  regionId: string;
  title: string;
  summary: string;
  structures: string[];
  commonDescriptions: string[];
  whatToNotice: string[];
  whenToSeekHelp: string[];
  notADiagnosis: string;
  status: EducationStatus;
  reviewedBy: string;
  reviewedDate: string;
  sourceOrRationale: string;
  version: string;
};

const DRAFT_REVIEW = {
  status: 'draft' as const,
  reviewedBy: '',
  reviewedDate: '',
  sourceOrRationale:
    'Draft orientation content based on the Anatomy Explorer product schema and clinical governance rules. Physiotherapist review is required before publication.',
  version: '0.1-draft',
};

export const EDUCATION_ENTRIES: EducationEntry[] = [
  {
    id: 'neck-general',
    regionId: 'neck',
    title: 'Understanding the neck area',
    summary:
      'The neck connects the head with the upper trunk and supports movement in several directions. This overview uses broad, everyday anatomy language.',
    structures: [
      'Bones and joints of the cervical spine',
      'Muscles and connective tissues around the neck and upper shoulders',
      'Nerves and other soft tissues that pass through the area',
    ],
    commonDescriptions: [
      'Some people describe aching, stiffness, tightness, or discomfort with movement.',
      'Sensations can be felt at the front, side, or back of the neck.',
    ],
    whatToNotice: [
      'Whether the sensation changes with position or gentle movement',
      'Whether it stays in one area or is also felt elsewhere',
      'Whether it is stable, improving, or becoming more noticeable',
    ],
    whenToSeekHelp: [
      'Consider speaking with a clinician if discomfort is persistent, worsening, or affecting usual activities.',
      'Use urgent medical care if a configured safety-check symptom applies.',
    ],
    notADiagnosis:
      'This information describes the body area only. It does not identify the cause of discomfort or replace an assessment by a qualified clinician.',
    ...DRAFT_REVIEW,
  },
  {
    id: 'shoulder-general',
    regionId: 'shoulder',
    title: 'Understanding the shoulder area',
    summary:
      'The shoulder is a mobile area where the upper arm meets the trunk. Movement here is shared across several joints and surrounding tissues.',
    structures: [
      'The upper arm bone, shoulder blade, and collarbone',
      'Joints that coordinate arm and shoulder-blade movement',
      'Muscles, tendons, and other soft tissues around the shoulder',
    ],
    commonDescriptions: [
      'Some people describe aching, stiffness, catching, or discomfort when reaching.',
      'Sensations can be felt at the front, top, back, or outer upper arm.',
    ],
    whatToNotice: [
      'Which arm positions make the sensation more or less noticeable',
      'Whether it stays near the shoulder or is also felt elsewhere',
      'Whether usual reaching, lifting, or resting positions have changed',
    ],
    whenToSeekHelp: [
      'Consider speaking with a clinician if discomfort is persistent, worsening, or affecting usual activities.',
      'Use urgent medical care if a configured safety-check symptom applies.',
    ],
    notADiagnosis:
      'This information describes the body area only. It does not identify the cause of discomfort or replace an assessment by a qualified clinician.',
    ...DRAFT_REVIEW,
  },
];

assertValidEducationEntries(EDUCATION_ENTRIES);

export function findEducationEntry(regionId: string | undefined): EducationEntry | undefined {
  return EDUCATION_ENTRIES.find((entry) => entry.regionId === regionId && entry.status === 'published');
}
