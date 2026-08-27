export type SafetySeverity = 'urgent';
export type SafetyRuleStatus = 'draft' | 'published' | 'retired';

export type SafetyRule = {
  id: string;
  optionLabel: string;
  severity: SafetySeverity;
  title: string;
  message: string;
  actionLabel: string;
  status: SafetyRuleStatus;
  reviewedBy: string;
  reviewedDate: string;
  version: string;
};

const DRAFT_REVIEW = {
  status: 'draft' as const,
  reviewedBy: '',
  reviewedDate: '',
  version: '0.1-draft',
};

const URGENT_TITLE = 'This symptom needs urgent medical assessment.';
const URGENT_MESSAGE =
  'Do not use this exercise guide for this problem. Contact emergency services or urgent medical care now, depending on severity.';

export const SAFETY_RULES: SafetyRule[] = [
  {
    id: 'chest-breathing-collapse',
    optionLabel: 'Chest pain, severe shortness of breath, collapse, or loss of consciousness',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'sudden-neurological-change',
    optionLabel: 'Sudden face, arm, or leg weakness, or new speech or vision difficulty',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'bladder-bowel-control',
    optionLabel: 'New loss of bladder or bowel control',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'saddle-numbness',
    optionLabel: 'Numbness in the saddle area',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'major-trauma-fracture-weight-bearing',
    optionLabel: 'Major trauma, possible fracture, or inability to bear weight',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'severe-rapidly-worsening',
    optionLabel: 'Severe, rapidly worsening pain',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'fever-severe-pain-swelling',
    optionLabel: 'Fever with severe pain, redness, swelling, or feeling acutely unwell',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
  {
    id: 'progressive-neurological-symptoms',
    optionLabel: 'Progressive weakness or widespread new neurological symptoms',
    severity: 'urgent',
    title: URGENT_TITLE,
    message: URGENT_MESSAGE,
    actionLabel: 'Start over',
    ...DRAFT_REVIEW,
  },
];

export const SAFETY_CHECK_OPTIONS = [
  { id: 'none', label: 'None of these' },
  ...SAFETY_RULES.map((rule) => ({ id: rule.id, label: rule.optionLabel })),
  { id: 'unsure', label: "I'm not sure" },
];

export function isSafetyCheckOption(optionId: string): boolean {
  return SAFETY_CHECK_OPTIONS.some((option) => option.id === optionId);
}

export function findSafetyRule(optionId: string): SafetyRule | undefined {
  return SAFETY_RULES.find((rule) => rule.id === optionId);
}
