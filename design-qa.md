# Design QA — 下一次预约卡片

## Source visual truth

- Source image: external clipboard reference, not stored in the repository.
- Source pixels: 672 × 156 PNG, supplied as the target card reference.

## Implementation evidence

- Implementation URL: `http://127.0.0.1:8797/`
- Full browser screenshot: temporary validation artifact, not stored in the repository.
- Appointment redesign screenshot: temporary validation artifact, not stored in the repository.
- Global typography verification screenshot: temporary validation artifact, not stored in the repository.
- Focused card capture: temporary validation artifact, not stored in the repository.
- Browser viewport: 430 × 900 CSS px; app phone screen is 375px wide.
- Focused implementation card: 339 × 117 CSS px; browser screenshot density is 1x.
- State: 首页 / 下一次预约 / waiting order.

## Comparison

The source and implementation were opened and compared visually. The reference uses a compact white rounded card with hospital-first hierarchy, location and patient metadata, emphasized date/time, and a companion avatar at top right. The implementation now follows that structure and removes the previous teal top rule, filled action button, and arrow link.

Focused-region evidence:

- Typography: hospital name is an 18px/700 title aligned with the reduced page scale; date/time is a 14px/700 teal label; supporting metadata is smaller and muted.
- Spacing/layout: avatar is anchored in the upper-right column; the card ends after the appointment information; the card remains readable on the 375px mobile screen.
- Colors/tokens: white rounded card, teal time emphasis, transparent action link, and soft environmental shadow align with `DESIGN.md`.
- Imagery/icons: the existing gender-specific default avatar is reused; map-pin, clock, and chevron remain the existing icon-library assets.
- Copy/content: dynamic hospital, campus, patient, date, hours, companion, and visit-code CTA render from the current order data. The source’s exact sample names/date are not hard-coded.

Responsive check: at the 430px browser viewport, the card content stays within its phone frame, the time line remains single-line, and the appointment title/action remain readable. The prototype shell retains its existing 375px minimum width.

Interaction check: clicking the appointment card opened the order-detail state and displayed the visit-code content. Browser warning/error logs were empty after reload.

## Findings

No actionable P0/P1/P2 differences remain for the requested card restyle.

## Comparison history

- Initial implementation used the newer date-block/grid card and did not match the supplied reference hierarchy.
- Fix applied: replaced the date block with hospital/location/time content, moved the companion avatar to the upper-right, and removed the teal top rule, filled action row, and arrow link.
- Post-fix evidence: temporary validation artifact, not stored in the repository; interaction and responsive checks passed.
- Typography update evidence: temporary validation artifact, not stored in the repository; all prototype CSS and inline font sizes were reduced by one scale step, and the 20-40 user typography standard is recorded in `DESIGN.md`.

## Follow-up polish

- The current mock data fits the hospital title on one line at the 375px phone width; longer real hospital names may wrap naturally.

final result: passed
