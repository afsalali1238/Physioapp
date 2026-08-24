/**
 * Clinic identity and regulatory identifiers.
 *
 * Every value the disclaimer needs in order to satisfy docs/RESEARCH-FINDINGS.md
 * §4 lives here, in one file, so it cannot drift between pages.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  ACTION REQUIRED BEFORE LAUNCH
 *  Values marked with PLACEHOLDER_MARKER are unknown to the build and MUST be
 *  supplied by the clinic. They were deliberately left blank rather than
 *  guessed: a wrong DHA facility licence number on patient-facing material is
 *  worse than a visibly missing one.
 *
 *  `npm run check:compliance` warns about every remaining placeholder, and
 *  fails hard when COMPLIANCE_STRICT=1 — set that in the production
 *  environment so an unfilled licence number can never reach a patient.
 * ────────────────────────────────────────────────────────────────────────────
 */

import { PLACEHOLDER_MARKER } from '../lib/compliance';

export interface ClinicIdentity {
  /** Registered legal entity name, not the trading/brand name. */
  readonly legalName: string;
  /** Brand name shown in the top bar. */
  readonly displayName: string;
  /** DHA facility licence number. */
  readonly dhaFacilityLicence: string;
  /** Supervising physiotherapist, as registered. */
  readonly physiotherapistName: string;
  /** That physiotherapist's DHA professional licence number. */
  readonly physiotherapistLicence: string;
  /** Medical Director accountable for content approval (RESEARCH-FINDINGS §4). */
  readonly medicalDirector: string;
  /** Clinic phone, for the stop-and-contact clause. */
  readonly phone: string;
  /**
   * Date the clinician last reviewed the content, ISO YYYY-MM-DD.
   * This is a clinical sign-off date, so it is set by hand — never from the
   * build date, which would silently claim a review that never happened.
   */
  readonly lastContentReview: string;
  /** Emergency numbers. UAE: 998 ambulance, 999 police. */
  readonly emergencyNumbers: string;
  /** Year used in the copyright line. */
  readonly copyrightYear: string;
}

export const CLINIC: ClinicIdentity = {
  legalName: PLACEHOLDER_MARKER,
  displayName: 'Physiotherapy',
  dhaFacilityLicence: PLACEHOLDER_MARKER,
  physiotherapistName: PLACEHOLDER_MARKER,
  physiotherapistLicence: PLACEHOLDER_MARKER,
  medicalDirector: PLACEHOLDER_MARKER,
  phone: PLACEHOLDER_MARKER,
  lastContentReview: PLACEHOLDER_MARKER,
  emergencyNumbers: '998 (ambulance) or 999',
  copyrightYear: '2026',
};

/** Which fields are still unfilled. Used by the compliance gate. */
export function missingClinicFields(): string[] {
  return Object.entries(CLINIC)
    .filter(([, value]) => typeof value === 'string' && value.includes(PLACEHOLDER_MARKER))
    .map(([key]) => key);
}
