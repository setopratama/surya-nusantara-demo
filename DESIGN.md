# DESIGN.md

# Surya Nusantara --- Kuis Dedikasi Di Balik Rasa

## Responsive Web Game Design System & Implementation Guidelines

**Document purpose:** Design and implementation reference for the
mobile-browser game experience.\
**Source of truth:** *5. Brief Games -- Kuis Dedikasi Di Balik Rasa.pdf*
(Semester 2, 2026), especially pages 2--13.\
**Design direction:** Modern Nusantara Craftsmanship --- Premium,
Masculine, Warm, Interactive.\
**Platform:** Responsive web application; no app installation required.

------------------------------------------------------------------------

## 1. Product and experience context

"Kuis Dedikasi Di Balik Rasa" is an interactive online quiz intended to
introduce Surya Nusantara, its brand identity, product features, and
campaign message through a consistent Consumer Engagement experience.

The experience should express the campaign idea **"Dedikasi Di Balik
Rasa"** and the values described in the client brief:

-   Dedication and seriousness.
-   Consistency and precision.
-   Craftsmanship and competence.
-   Attention to detail.
-   A mature, warm, confident, grounded character.

The interface is not a generic trivia template. It should feel like a
coherent digital extension of the campaign identity while keeping the
quiz itself clear, quick, and easy to operate.

### Primary experience principles

1.  **Campaign consistency** --- every screen belongs to one
    recognizable visual ecosystem.
2.  **Clarity first** --- the question, answer choices, timer, and
    current progress must be immediately understandable.
3.  **Focused interaction** --- avoid decorative UI that competes with
    the task.
4.  **Craft-led visual language** --- use restrained material cues, warm
    lighting, precise lines, and considered spacing.
5.  **Responsive by design** --- optimize for a phone held in one hand,
    then adapt gracefully to larger screens.

------------------------------------------------------------------------

## 2. Design direction

### 2.1 Creative concept

**Modern Nusantara Craftsmanship**

Translate the brief's craftsmanship theme into a contemporary digital
interface. The visual language should communicate care, skill,
precision, and dedication without relying on excessive traditional
ornaments.

Use: - Deep brown surfaces as the visual anchor. - Gold as a restrained
highlight for emphasis and progress. - Cream or warm ivory for readable
content surfaces. - Warm reddish-brown as a limited accent for selected
feedback or emphasis. - Subtle tonal gradients, fine borders, and
restrained shadows. - Photography or campaign imagery focused on skilled
hands, tools, process, and experienced working adults, where approved
campaign assets are available.

Avoid: - Overuse of batik, ethnic patterns, or decorative cultural
motifs. - Busy textures behind text. - Excessive glow, bevels, metallic
effects, or ornamental frames. - Cartoonish game graphics, childish
badges, or casino-like visual effects. - Visual effects that make the
quiz slower or harder to read.

### 2.2 Mood and tone

  -----------------------------------------------------------------------
  Attribute                           Direction
  ----------------------------------- -----------------------------------
  Premium                             Confident, restrained, carefully
                                      composed

  Masculine                           Strong typography, grounded
                                      proportions, solid surfaces

  Warm                                Brown/cream palette and warm image
                                      treatment

  Craftsmanship                       Precision, detail, process, and
                                      considered interaction

  Interactive                         Clear feedback, visible progress,
                                      responsive controls

  Contemporary                        Clean layouts and familiar browser
                                      interactions
  -----------------------------------------------------------------------

### 2.3 Brand voice in interface

Use concise Indonesian microcopy. The voice should be mature, confident,
direct, and respectful. Avoid slang, exaggerated hype, or language that
feels childish.

Examples of neutral interface labels: - "Mulai" - "Lanjutkan" - "Pilih
jawaban" - "Waktu tersisa" - "Jawaban benar" - "Jawaban belum tepat" -
"Lihat hasil"

Any campaign or product-specific copy must be supplied or approved by
the client. Do not invent product claims or comparative claims in UI
copy.

------------------------------------------------------------------------

## 3. Design tokens

The following HEX values are **proposed working tokens**,
sampled/interpreted from the palette direction in the brief. They are
not confirmed official brand values. Replace them with approved brand
values or color references when provided.

### 3.1 Color palette

  ------------------------------------------------------------------------------
  Token                                     Proposed value Usage
  --------------------------- ---------------------------- ---------------------
  `color-brown-950`                              `#28170F` Main dark background

  `color-brown-900`                              `#382014` Primary dark surface

  `color-brown-800`                              `#50371F` Elevated dark surface

  `color-brown-700`                              `#705321` Secondary brown /
                                                           gold-brown

  `color-gold-500`                               `#C49A45` Primary highlight,
                                                           progress, key accent

  `color-gold-300`                               `#E2C47B` Highlight on dark
                                                           surfaces

  `color-cream-100`                              `#F1EBDD` Main light background

  `color-cream-50`                               `#FAF7F0` Cards and form
                                                           surfaces

  `color-ink-900`                                `#2B211B` Text on light
                                                           surfaces

  `color-ink-600`                                `#6E6258` Secondary text on
                                                           light surfaces

  `color-accent-terracotta`                      `#A94F3C` Limited accent; never
                                                           sole status indicator

  `color-success`                                `#3F7657` Correct-answer status

  `color-error`                                  `#A7473B` Incorrect-answer
                                                           status

  `color-border-light`                           `#DED5C5` Light-surface borders

  `color-border-dark`                            `#6C563A` Dark-surface borders
  ------------------------------------------------------------------------------

**Contrast requirement:** Body text and controls must maintain readable
contrast. Gold text on cream should not be used for small text. Use dark
ink on cream and cream/white on dark brown. Status must be communicated
through text/iconography as well as color.

### 3.2 Typography

The client brief (page 6) specifies a typography character that is **warm, bold, and clean**, aligned with the existing "Dedikasi Di Balik Rasa" identity. The campaign key visual on page 5 uses a strong, condensed headline treatment, while the supplied Surya Nusantara Raya logo uses distinctive custom lettering.

The interface must therefore distinguish between **brand typography** and **functional UI typography**. Do not attempt to recreate the logo or campaign lettering using a standard font.

#### Recommended type system

| Role | Recommended family | Weight | Rationale |
|---|---|---:|---|
| Official logo / brand lockup | Supplied official logo artwork (SVG preferred; transparent PNG acceptable) | N/A | The lettering is bespoke brand artwork, not a replaceable UI font. |
| Campaign / display headings | Roboto Condensed | 600–700 | Condensed proportions echo the strong headline treatment in the campaign visual while remaining clean and readable. |
| Page headings | Roboto Condensed | 600–700 | Maintains visual continuity with campaign headings without making the interface feel ornamental. |
| Body and form text | Roboto | 400–500 | Neutral, familiar, highly legible on mobile browsers and suitable for longer instructions and form labels. |
| Buttons and UI labels | Roboto | 500–600 | Clear at small sizes and visually consistent with body copy. |
| Score and timer | IBM Plex Mono | 600–700 | Gives scores and countdowns a precise, technical readout; monospaced digits remain stable as values change. |

**Recommended type system:** `Roboto Condensed` for display hierarchy + `Roboto` for interface and reading + `IBM Plex Mono` for score and timer. This replaces the earlier Oswald / Inter / Montserrat suggestion while retaining IBM Plex Mono for numeric game feedback.

#### Why this is the better fit

- **Closer to the supplied campaign visual:** the page 5 campaign headline is tall, compact, and emphatic. Roboto Condensed supports that direction without copying the custom logo lettering.
- **Consistent with the written brief:** the pairing is bold and clean, while the warm character is carried primarily by the brown/gold/cream palette, photography, spacing, and restrained composition—not by an overly decorative font.
- **Better separation of roles:** display headings can carry campaign character; body text and controls remain easy to read and operate.
- **Practical for responsive web:** both families are widely supported and available as web fonts. Use optimized WOFF2 files or a controlled font provider, with local system fallbacks.

Fallback stacks:
- Display: `"Roboto Condensed", "Arial Narrow", Arial, sans-serif`
- UI/body: `Roboto, "Helvetica Neue", Arial, sans-serif`
- Score/timer: `"IBM Plex Mono", "SFMono-Regular", Consolas, monospace`

#### Typography rules

- Body text: 16px minimum on mobile for primary reading.
- Supporting text: 14px minimum where possible; avoid long paragraphs at this size.
- Question text: 22–24px on mobile, 26–30px on wider screens.
- Button text: 16px, weight 600.
- Page headings: 28–36px on mobile, scaling up carefully on larger screens.
- Use sentence case for UI labels.
- Reserve all-caps for short campaign labels or compact metadata, not paragraphs or instructions.
- Use IBM Plex Mono for countdowns and scores; its monospaced numerals keep the score/timer width stable. Add `font-variant-numeric: tabular-nums` as a defensive fallback.
- Keep line-height around 1.45–1.6 for body copy and 1.1–1.25 for display headings.
- Do not use the display face for long form instructions, legal copy, or dense registration options.

#### Asset and approval note

The brief does not specify exact font-family names or provide a formal typography guideline. `Roboto Condensed` + `Roboto` is therefore a **recommended implementation pairing**, not a claim about the client's official brand fonts. If the client supplies an existing campaign font or brand guideline, that approved source takes precedence. The official logo and campaign lockup must always be used as supplied artwork; never retype them in Roboto Condensed or another substitute font.

### 3.3 Spacing and sizing

Use a 4px base spacing scale.

  Token          Value
  ------------ -------
  `space-1`        4px
  `space-2`        8px
  `space-3`       12px
  `space-4`       16px
  `space-5`       20px
  `space-6`       24px
  `space-8`       32px
  `space-10`      40px
  `space-12`      48px
  `space-16`      64px

Recommended dimensions: - Mobile page gutter: 20px; reduce to 16px only
on very narrow screens. - Tablet page gutter: 32px. - Desktop page
gutter: 40px. - Main content max-width: 560px for quiz/form flows. -
Wider intro or result composition: max-width 960px. - Button minimum
height: 48px. - Answer option minimum height: 56px. - Touch target: at
least 44 × 44px. - Card radius: 12--16px. - Button radius: 10--12px. -
Input radius: 10px. - Border width: 1px.

### 3.4 Elevation and surface treatment

Use elevation sparingly: - Light surfaces: soft, low-opacity shadow. -
Dark surfaces: use tonal separation and a fine border instead of heavy
shadow. - Avoid large blurred shadows that muddy the premium visual
language. - Keep backgrounds smooth, consistent with the brief's
direction for smooth texture without cultural ornament.

------------------------------------------------------------------------

## 4. Responsive layout system

### 4.1 Breakpoints

Use content-driven breakpoints rather than device-specific assumptions.

  ------------------------------------------------------------------------
  Breakpoint                                   Width Layout behavior
  --------------------- ---------------------------- ---------------------
  Small mobile                             `< 360px` Single column,
                                                     compact gutters, wrap
                                                     long labels

  Mobile                                 `360–767px` Primary target;
                                                     single-column flow

  Tablet                                `768–1023px` Centered narrow
                                                     content, more
                                                     breathing room

  Desktop                                `>= 1024px` Centered experience;
                                                     optional side-by-side
                                                     visual and content

  Wide desktop                           `>= 1440px` Preserve max-width;
                                                     do not stretch quiz
                                                     content
  ------------------------------------------------------------------------

### 4.2 Mobile-first rules

Mobile browser is the primary experience: - One column for all critical
tasks. - Keep the primary action visible without requiring excessive
scrolling. - Use a fixed or sticky bottom action area only when it does
not obscure content or browser controls. - Respect device safe areas
using `env(safe-area-inset-*)`. - Do not depend on hover states. - Keep
forms easy to complete with a thumb. - Avoid horizontal scrolling. -
Avoid layouts that require pinch zoom. - Ensure the page works in
portrait; landscape remains usable but is not the primary composition.

### 4.3 Larger screens

On tablet and desktop: - Keep quiz and form content constrained to a
readable width. - Use campaign imagery as a supporting panel only where
it does not distract. - Do not enlarge answer options or question text
excessively. - Preserve the same interaction order and hierarchy as
mobile. - Avoid turning the quiz into a dashboard-like desktop
interface.

------------------------------------------------------------------------

## 5. Application shell

### 5.1 Global screen structure

Recommended shell: 1. Background layer. 2. Compact campaign/brand header
area using approved logo assets. 3. Main content container. 4. Optional
progress or contextual information. 5. Primary action area. 6.
Footer/legal information where required by client and applicable
regulation.

The logo must use official supplied assets. Do not recreate, distort,
recolor, or approximate the logo without approval.

### 5.2 Background use

-   Use dark brown for campaign-led moments and game screens.
-   Use cream for form or information screens where it improves
    readability.
-   Keep background transitions consistent and purposeful.
-   If a campaign image is used, apply a dark overlay behind text to
    ensure legibility.
-   Never place essential instructions directly over visually complex
    imagery without a sufficient contrast layer.

------------------------------------------------------------------------

## 6. Screen-by-screen design specification

The client brief describes this flow: QR scan → landing page and age
verification → personal data registration → brand content → brand
message → questions → correct/incorrect feedback → loading/fun facts →
final score and redirect.

### Screen 0 --- QR entry

**Purpose:** Bring participants from printed or online activation
material into the browser experience.

Design requirements: - The QR itself belongs to the approved activation
asset, not the web application. - Ensure the destination opens in a
mobile browser. - Use a short, recognizable page title and campaign
identity after arrival. - Handle invalid, expired, or unavailable
campaign links with a simple fallback page.

### Screen 1 --- Landing page and age verification

**Purpose:** Verify eligibility before proceeding.

Layout: - Campaign identity/approved logo. - Short campaign
introduction. - Clear age confirmation statement. - Two explicit
choices: eligible / not eligible. - Primary CTA enabled only after a
valid affirmative selection.

Interaction: - No preselected affirmative option. - If the participant
is not eligible, stop the flow and show a neutral exit message. - Do not
allow bypass through direct URL navigation to later steps; validate
eligibility in the session and server-side flow. - Avoid collecting
unnecessary personal data before the age gate.

**Important client confirmation:** The flow on page 7 specifies
verification for age **21+**, while the registration age dropdown on
page 10 begins at **18--24**. These are not fully aligned. Confirm the
minimum eligible age and the age-band options with the client/legal team
before implementation. The age gate must take precedence and must not
admit anyone below the confirmed legal/brand eligibility threshold.

### Screen 2 --- Personal data registration

The brief lists these fields: 1. Name / username --- free text. 2. Age
--- dropdown: 18--24, 25--34, 35--44, 45+ years (subject to the age-gate
clarification above). 3. Domicile --- searchable city/regency dropdown
using a separate city/regency data file. 4. Occupation --- dropdown with
the categories supplied in the client brief. 5. Current cigarette brand
--- dropdown with the options supplied in the client brief.

Design requirements: - Use a single-column form on mobile. - Group
labels above inputs; never rely on placeholder text as the only label. -
Use native input semantics and appropriate mobile keyboard types. -
Searchable domicile selection must support keyboard and touch
interaction. - Dropdown lists should be searchable if the option set is
long. - Show validation beside the relevant field. - Preserve valid
entered values when a validation error occurs. - Show a concise
privacy/data-use notice approved by the client before submission. - Do
not request additional fields beyond the approved brief.

Occupation and brand option values should be supplied as
configuration/data, not hard-coded into UI components. Keep labels
exactly as approved by the client.

### Screen 3 --- Brand content

**Purpose:** Present the short brand content before the quiz.

Brief requirement: - Video or short story content. - Participant may
skip after the first 5 seconds.

Design requirements: - Use a responsive 16:9 media container for video
unless the supplied asset has another required ratio. - Provide visible
playback controls where applicable. - Show a clear skip action only
after the required 5-second period. - Do not auto-advance before the
minimum viewing period is complete. - Provide a fallback state if the
media cannot load. - Caption/subtitle support should be used when
supplied. - Ensure playback and skip behavior are testable and
consistent across mobile browsers.

### Screen 4 --- Brand message / campaign key visual

**Purpose:** Reinforce the approved campaign message before the quiz
begins.

Design requirements: - Use approved campaign key visual and approved
copy. - Maintain sufficient text contrast. - Use a single primary CTA to
continue. - Avoid adding unapproved product claims or messaging. - Keep
this moment visually distinct from the quiz while retaining the same
palette and typography system.

### Screen 5 --- Quiz questions

**Purpose:** Deliver 10 questions in one game set.

Brief requirements: - 10 questions per game. - Questions 1--7 are
randomly generated from the question bank. - Questions 8--10 must relate
to the brand message or content shown at the beginning. - Each question
has a 10-second answering period. - Give participants 3 seconds to read
the question before the timer begins. - Faster correct answers earn more
points; incorrect answers earn 0 points.

Recommended layout: 1. Compact header with campaign identity. 2.
Progress indicator: e.g. "Pertanyaan 3 dari 10". 3. Timer with numeric
countdown and visual progress. 4. Question text in a high-contrast card
or content area. 5. Answer options as large stacked buttons. 6. Optional
small score/progress context, only if it does not compete with the
question.

Interaction: - Start the 3-second reading period before the 10-second
scoring timer. - Disable answer interaction after the first selection. -
Prevent double submission. - Record answer and response time reliably. -
Correct answer: proceed according to the defined game logic. - Incorrect
answer: show the explanation pop-up/state, then continue. - Timeout:
treat according to the approved scoring rule; the brief's example
indicates an incorrect answer receives 0, but timeout behavior should be
confirmed. - Keep the timer visually clear without using flashing or
distracting animation. - Provide a non-color cue for correct/incorrect
states.

**Scoring interpretation from brief:** The brief describes 10 seconds =
10 points and gives an example of answering at second 7 = 7 points. It
also says faster answers receive higher points. Engineering should
confirm the exact formula and when the timer starts. A suggested
interpretation is `points = remaining whole seconds` for a correct
answer, with 0 for incorrect or timeout, but this formula must be
approved before build.

### Screen 6 --- Answer feedback

**Correct state:** - Clear "Jawaban benar" label. - Simple check icon or
equivalent visual cue. - Avoid excessive celebratory effects. - Continue
automatically or via a clear CTA, depending on the approved timing.

**Incorrect state:** - Clear "Jawaban belum tepat" label. - Show the
approved explanation for the question. - Make the explanation easy to
scan. - Provide a clear continuation action or controlled auto-advance.

Do not rely on red/green alone. Include text and iconography. Respect
reduced-motion settings.

### Screen 7 --- Loading and Nusantara facts

**Purpose:** Show fun facts about Nusantara/local wisdom while preparing
the next state or result.

Design requirements: - Use a calm, short loading animation. - Show one
approved fact at a time. - Use a subtle gold progress indicator. - Avoid
indefinite loading without status. - If loading fails, show a retry
state or safe fallback. - Facts must come from a client-approved content
source.

### Screen 8 --- Final score

**Purpose:** Present the final score and the next action.

Design requirements: - Make the score the dominant visual element. -
Include a concise completion message. - Keep the layout celebratory but
premium and restrained. - Provide the approved CTA to redirect to the
designated Surya Nusantara asset/channel. - Confirm whether the
destination opens in the same tab or a new tab. - Handle redirect
failure with a visible retry or fallback link. - Do not imply prizes,
rewards, or eligibility outcomes unless those are defined and approved
by the client.

The brief specifies a final score and a redirect button; ranking,
leaderboard, prize mechanics, and score-sharing are not specified and
should not be added without approval.

------------------------------------------------------------------------

## 7. Core components

### 7.1 Buttons

Variants: - **Primary:** Gold fill with dark text on dark surfaces, or
dark brown fill with cream text on light surfaces. - **Secondary:**
Transparent or surface fill with clear border. - **Text action:**
Minimal, for skip/back/low-emphasis actions.

States: - Default - Pressed - Focus-visible - Disabled - Loading

Rules: - Minimum 48px height. - Clear label; avoid icon-only primary
actions. - Keep disabled state visibly disabled and programmatically
disabled. - Provide visible keyboard focus.

### 7.2 Form controls

-   Labels always visible.
-   Input height: 48--56px.
-   Error message placed directly below the field.
-   Focus state uses a clear border/ring.
-   Search dropdown supports typed filtering, arrow-key navigation,
    Enter selection, Escape dismissal, and touch.
-   Do not clear unrelated fields after a validation error.

### 7.3 Answer option

-   Full-width option button on mobile.
-   Minimum height 56px.
-   Clear selected state.
-   Distinct focus-visible state.
-   After submission, lock all options.
-   Feedback state must not shift the page layout unexpectedly.

### 7.4 Progress indicator

-   Show current question and total question count.
-   Use a simple track and gold progress fill.
-   Include a textual equivalent for assistive technology.
-   Do not communicate progress using color alone.

### 7.5 Timer

-   Display remaining seconds numerically.
-   Use a subtle progress ring/bar if desired.
-   Use tabular numerals.
-   Avoid rapid flashing, shaking, or strobing.
-   Provide a clear state when the timer is paused, in reading delay,
    active, or expired.

### 7.6 Dialog / feedback panel

-   Use an accessible dialog pattern.
-   Keep content concise.
-   Focus must move into the dialog when opened and return appropriately
    when closed.
-   Do not trap users in a dialog without a clear next action.
-   On small screens, a bottom sheet may be used if it remains
    accessible and does not obscure the required content.

------------------------------------------------------------------------

## 8. Interaction and motion

Motion should support comprehension, not decoration.

Recommended: - 150--220ms for button and state transitions. - 200--300ms
for panel or card transitions. - Simple fade/slide transitions between
quiz states. - Subtle progress animation. - One restrained score reveal.

Avoid: - Long intro animations. - Parallax effects. - Large animated
backgrounds. - Motion that competes with the 10-second answer window. -
Any animation that delays access to a required control.

Respect `prefers-reduced-motion: reduce`. When reduced motion is
enabled, remove nonessential transitions and animated effects.

------------------------------------------------------------------------

## 9. Accessibility and usability

Target WCAG 2.2 AA as the implementation baseline.

Requirements: - Semantic landmarks and heading hierarchy. - Labels
associated with all inputs. - Keyboard-operable forms, dropdowns,
dialogs, and buttons. - Visible focus indicator. - Sufficient contrast
for text and controls. - Screen-reader announcement for question
changes, answer feedback, and score updates. - Do not announce every
timer tick; announce meaningful timer states without overwhelming
assistive technology. - Touch targets at least 44 × 44px. - Do not use
color as the only status indicator. - Respect reduced motion. - Ensure
zoom and text scaling do not break layout. - Provide captions/subtitles
when video captions are supplied. - Avoid time-critical interactions
that cannot be operated by the intended audience; the game timing is a
client-defined mechanic and should be tested with real devices and
accessibility review.

------------------------------------------------------------------------

## 10. Browser and performance requirements

The experience is browser-based and must not require installation.

Implementation requirements: - Responsive viewport configuration. -
Support current major mobile browsers, especially iOS Safari and Android
Chrome. - Avoid horizontal overflow. - Optimize campaign images and
video assets. - Use modern image formats where supported, with
fallbacks. - Lazy-load noncritical imagery. - Preload only assets needed
for the first visible screen. - Avoid heavy animation libraries for
simple transitions. - Ensure the game remains usable on moderate mobile
connections. - Show meaningful loading and error states. - Prevent
accidental double submission and duplicate score records. - Use
server-authoritative validation for eligibility, quiz sequence, scoring,
and result persistence.

Suggested performance targets: - Prioritize fast first contentful render
on mobile. - Keep the initial page payload lean. - Avoid loading the
full question bank and all media before needed. - Measure Core Web
Vitals on real mobile devices and representative network conditions.

------------------------------------------------------------------------

## 11. Data and state considerations for design/engineering

The brief specifies participant data capture and dashboard reporting.

### Participant capture

-   Personal data fields as defined in the approved registration form.
-   Domicile.
-   Play date/time timestamp.
-   Final score.

### Dashboard reporting

-   Total participants.
-   Score distribution.
-   Average score.
-   Participant city of origin.
-   Session date.
-   Export to Excel.

Design implications: - Registration consent/privacy notice must be
approved and visible. - Provide clear submission/loading/error states. -
Do not expose participant data in the public game interface. - Do not
show personal data in score/result screens unless explicitly approved. -
Data retention, access control, consent, and privacy policy are
implementation dependencies for the client/backend team.

------------------------------------------------------------------------

## 12. Content and asset requirements

Request from client before final visual production: - Official Surya
Nusantara and Surya Nusantara Raya logo assets. - Approved campaign key
visual and image library. - Approved brand message and final UI copy. -
Brand video/story asset and subtitles, if available. - Approved question
bank (40 questions referenced in the brief). - Correct answer and
explanation for each question. - Approved Nusantara facts/local wisdom
content. - Approved destination URL for final redirect. - Official brand
color values and typography, if defined. - Privacy notice and legal
copy. - Final eligibility age requirement and approved age-band list.

Do not substitute generated logos, unapproved product pack imagery, or
invented claims for official assets.

------------------------------------------------------------------------

## 13. Design QA checklist

### Visual

-   [ ] Brown, gold, and cream palette is consistent.
-   [ ] No excessive cultural ornament or distracting texture.
-   [ ] Typography is readable on small mobile screens.
-   [ ] Official logo and campaign assets are used correctly.
-   [ ] Text contrast is sufficient on every background.
-   [ ] Visual hierarchy makes the next action obvious.

### Responsive

-   [ ] Tested at 320px, 360px, 390px, 768px, 1024px, and 1440px widths.
-   [ ] No horizontal scrolling.
-   [ ] Buttons and inputs are comfortable to tap.
-   [ ] Sticky elements do not cover browser controls or content.
-   [ ] Safe-area insets are respected.
-   [ ] Portrait and landscape layouts remain usable.

### Flow and game logic

-   [ ] Age verification occurs before registration and later screens
    cannot be accessed by bypassing it.
-   [ ] Age threshold conflict is resolved with client/legal.
-   [ ] Registration validation preserves entered values.
-   [ ] Brand content skip becomes available only after the specified 5
    seconds.
-   [ ] Three-second question reading period is implemented.
-   [ ] Ten-second answer timer is implemented and tested.
-   [ ] Scoring formula is confirmed and matches the approved rule.
-   [ ] Questions 1--7 are selected from the bank according to the
    approved randomization.
-   [ ] Questions 8--10 relate to the approved brand message/content.
-   [ ] Incorrect-answer explanation is displayed correctly.
-   [ ] Timeout behavior is confirmed.
-   [ ] Final score is persisted once.
-   [ ] Final redirect works and has a fallback.

### Accessibility and performance

-   [ ] Keyboard navigation works.
-   [ ] Focus states are visible.
-   [ ] Screen-reader labels and announcements are tested.
-   [ ] Reduced-motion preference is respected.
-   [ ] Video fallback and loading/error states work.
-   [ ] Tested on iOS Safari and Android Chrome.
-   [ ] Performance checked on a moderate mobile connection.

------------------------------------------------------------------------

## 14. Open questions and client decisions

The following items are not fully resolved by the supplied brief and
must be confirmed rather than assumed:

1.  **Eligibility age:** page 7 says 21+, while page 10 lists an 18--24
    age band. Confirm the actual minimum age and registration options.
2.  **Scoring formula:** confirm whether a correct answer earns the
    number of seconds remaining, or another calculation.
3.  **Timer start:** confirm whether the 10-second timer starts
    immediately after the 3-second reading delay.
4.  **Timeout handling:** confirm whether timeout is treated as
    incorrect and whether an explanation is shown.
5.  **Feedback duration:** confirm whether correct answers auto-advance
    and how long incorrect-answer explanations remain visible.
6.  **Question randomization:** confirm whether randomization avoids
    repeats across a participant's session and how question difficulty
    is balanced.
7.  **Video skip:** confirm whether the 5-second threshold is measured
    from playback start and how buffering affects it.
8.  **Final destination:** provide the exact redirect URL and tab
    behavior.
9.  **Privacy and consent:** provide approved data-use notice, consent
    requirements, retention period, and privacy policy.
10. **Official design assets:** provide official logo, color values,
    fonts, approved imagery, and campaign copy.

------------------------------------------------------------------------

## 15. Definition of done

The design is ready for development handoff when: - The mobile-first
screens for the complete journey are designed. - Tablet and desktop
responsive behavior is documented. - All core components and states are
specified. - Final approved campaign assets and copy are available. -
Age eligibility and scoring rules are resolved. - Error, empty, loading,
timeout, and feedback states are covered. - The design QA checklist has
been reviewed with product, engineering, and client stakeholders.

**North-star direction:** A clear, responsive, premium-feeling quiz
experience that translates *Dedikasi Di Balik Rasa* into a consistent
digital interface---without compromising usability, accessibility, or
the approved client flow.
