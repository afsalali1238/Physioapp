# Unified Data Schema

The unified app has one clinical content domain and one anatomy presentation domain. Anatomy data references stable library IDs; it never duplicates exercise instructions or dosage.

## Areas

`id, area_id, section, name_en, name_ar, order, status, notes_internal`

`section` is `stretching` or `exercise`. Published areas appear only when they have at least one published item.

## Items

`id, section, area_id, order, status, name_en, name_ar, type, start_position_en, movement_en, direction_en, return_en, safety_en, target_muscles_en, hold_seconds, reps, sets, rest_seconds, each_side, frequency_en, image_id, image_alt_en, image_status, motion_id, motion_status, motion_poster_id, motion_alt_en, reviewed_by, reviewed_date, notes_internal`

Published rows require appropriate instructions, at least one dosage value, image and alt text, and review metadata. Stretching requires direction; exercises require type and return.

## Anatomy regions

`id, library_area_ids[], name_en, name_ar, order, status, full_body_mesh_ids[], hit_mesh_ids[], camera_target, camera_position, front_asset_id, back_asset_id, regional_asset_id, simple_asset_id, description_en, reviewed_by, reviewed_date, version`

`library_area_ids` must resolve to existing published stretching/exercise areas. This is the single mapping that prevents dead-end map regions.

## Precision zones

`id, region_id, side, surface, label_en, label_ar, regional_mesh_ids[], hit_mesh_ids[], hotspot_geometry, camera_target?, confirmation_text_en, status, reviewed_by, reviewed_date, version`

Hotspots are generated from a shared joint/geometry table. Geometry is presentation data, not clinical interpretation.

## Education mappings

`id, region_id, zone_id?, title_en, summary_en, structures_en, normal_function_en, common_descriptions_en, common_scenarios_en, aggravating_activities_en, when_to_seek_help_en, not_a_diagnosis_en, status, reviewed_by, reviewed_date, version`

Education is optional and published only with clinical review. It may use broad structures and patient vocabulary; it may not name a diagnosis or infer cause.

Add operational fields to clinical records:

`review_status, clinical_owner_id, evidence_or_rationale, source_references, generated_by, generated_at, unresolved_questions, medical_approval_required, review_due_date, content_version, visual_reviewed_by, visual_reviewed_date`

Anatomy regions also define `precision_mode: broad_only | education_variant | reviewed_mapping`.
Only the latter two may show exact-zone selection.

## Educational hotspots

`id, region_id, zone_id?, structure_id, label_en, body_en, mesh_ids[], marker_position, status, reviewed_by, reviewed_date, version`

Hotspots explain approved anatomy structures or spatial relationships. They are not pain-cause mappings. A hotspot may be shown only when its text and model placement are approved.

## Anatomy assets

`id, region_id?, kind, url, bytes, compression, texture_bytes, checksum, lod, status, reviewed_by, reviewed_date`

`kind` is `locator`, `regional`, `layer`, or `fallback`. The build fails on missing files, duplicate IDs, an unapproved patient-facing asset, or assets exceeding the configured budget without an explicit waiver.

## Exercise mappings

`education_id, exercise_id, relationship, note_en, status, reviewed_by, reviewed_date, version`

Mappings point to existing published item IDs. The anatomy layer never creates a prescription, changes dosage, or substitutes for the item safety content.

## Safety rules

`id, trigger_type, trigger_values, severity, title_en, message_en, action_label_en, action_href, status, reviewed_by, reviewed_date, version`

Rules are explicit and deterministic. The minimum set covers chest pain/severe breathlessness/collapse, sudden neurological change, bladder or bowel loss, saddle numbness, major trauma or inability to bear weight, severe rapidly worsening pain, fever with acute local signs, and progressive or widespread neurological symptoms.

## Runtime state

```ts
type UnifiedState = {
  screen: 'home' | 'locate' | 'confirm' | 'zone' | 'safety' | 'result' | 'stop';
  view: 'front' | 'back';
  regionId?: string;
  zoneId?: string;
  confirmed: boolean;
  safetyState: 'unopened' | 'clear' | 'interrupted';
};
```

Selections remain in memory. No server persistence is permitted in v1.

## Validation invariants

- Stable IDs are unique and never reused.
- Published rows have review metadata.
- Published anatomy regions resolve to published library areas.
- Published mappings resolve to published exercise IDs.
- Every published region has an accessible simple asset.
- Every selectable region is reachable by keyboard and semantic list.
- Every published mesh mapping resolves to a mesh in the registered GLB.
- Every published zone has a visual target and a semantic control.
- Camera targets remain within reviewed framing bounds.
- Published hotspots have clinical review and visual-placement review.
- Patient-facing strings pass shared compliance and anatomy-specific diagnostic-language checks.
- Published clinical content cannot be past `review_due_date` without a visible build warning and release approval.
- Patient routes never load draft content or draft media, including through predictable asset URLs.
- Approved motion passes duration, byte-size, poster, format, and reduced-motion fallback checks.
