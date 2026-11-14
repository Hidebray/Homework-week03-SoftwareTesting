# Interface Aspects (IA-01 to IA-04) Heuristic Testing Guide

This guide provides test engineers and AI test agents with heuristic prompts, verification criteria, and common defect patterns across the four core Interface Aspects (IA).

---

## 1. IA-01: General UI Standards (Visual Hierarchy & Consistency)

### Objective
Ensure that the user interface adheres to standard visual design principles, maintains cross-screen consistency, complies with accessibility baselines (WCAG 2.1 AA), and adapts gracefully across diverse viewport dimensions.

### Core Heuristic Checkpoints
1. **Typography & Hierarchy:**
   - Are heading levels (`H1`, `H2`, `H3`) visually distinct and proportionally sized relative to body text?
   - Is font styling (family, weight, line-height) consistent across all tabs, cards, and tables?
   - Are currency amounts, dates, and numeric metrics formatted in a human-readable, localized manner (e.g., `150.000 ₫`, `YYYY-MM-DD`)?
2. **Spacing & Alignment:**
   - Do elements adhere to a uniform 4px / 8px spacing grid?
   - Are text blocks and numeric columns properly aligned (text left-aligned, numbers/currency right-aligned, status badges centered)?
   - Are card paddings and container margins balanced without overlapping or clipped boundaries?
3. **Color & Contrast (WCAG 2.1 AA):**
   - Does text meet the minimum 4.5:1 contrast ratio against its background (3:1 for large text)?
   - Is color never used as the sole conveyor of information (e.g., red badges also have textual labels like "Expired" or "Failed")?
4. **Responsive Layout & Viewport Scaling:**
   - Does the layout scale gracefully between standard desktop (1920x1080, 1366x768) and mobile/tablet viewport sizes?
   - Do data tables provide horizontal scrolling or collapse into readable card views rather than causing full-page viewport blowout?

---

## 2. IA-02: Forms & Input Controls (Data Capture & Constraints)

### Objective
Verify that all data input controls (text inputs, selects, date pickers, file uploads) communicate expectations clearly, enforce boundary conditions client-side, and handle anomalous or malicious inputs gracefully.

### Core Heuristic Checkpoints
1. **Labels, Placeholders & Required Indicators:**
   - Does every input field have a persistent, readable label (not just a disappearing placeholder)?
   - Are mandatory fields clearly flagged (e.g., red asterisk `*` or `(required)`)?
   - Do placeholders provide clear, realistic syntax hints (e.g., `CODE2026`, `https://example.com/image.png`)?
2. **Input Validation & Boundary Constraints:**
   - Are numerical bounds explicitly enforced in HTML5 attributes (e.g., `min="0"`, `max="100"` for discount percentages)?
   - Does the date picker enforce temporal validity (e.g., `min="today"` to prohibit selecting past dates for promotional coupons)?
   - Are whitespace-only, extreme-length, and special character inputs sanitized without crashing?
3. **File Upload Verification (e.g., CSV Imports):**
   - Does the file upload control enforce accepted MIME types (e.g., `.csv` only, rejecting `.exe` or `.txt`)?
   - Does the parser handle embedded commas within quoted strings (e.g., `"T-shirt, Red, Size L"`) without misaligning columns?
   - Is there a preview table displayed before committing bulk database mutations?
4. **Form Reset & State Preservation:**
   - Does the form clear its inputs after a successful submission?
   - When switching tabs and returning, is unfinished form state predictably preserved or cleanly reset?

---

## 3. IA-03: Navigation & Action Layout (Spatial Logic & Ergonomics)

### Objective
Ensure that user navigation is intuitive, spatial relationships respect human-computer interaction ergonomics (such as Fitts's Law), and action controls prevent inadvertent user errors.

### Core Heuristic Checkpoints
1. **Menu & Route State:**
   - Does the sidebar navigation clearly highlight the currently active tab (color, border, or background accent)?
   - Does clicking a tab switch views instantly without unnecessary full-page refreshes?
   - Does browser back/forward navigation respect internal SPA states where applicable?
2. **Action Placement & Fitts's Law:**
   - Are primary call-to-action buttons (e.g., "Add Product", "Create Coupon") prominent and easily reachable?
   - Are destructive buttons (e.g., "Delete", "Cancel Order") physically separated or padded from positive confirmation buttons to prevent misclicks?
   - Are action buttons large enough for touch targets (minimum 44x44 CSS pixels on mobile viewports)?
3. **Keyboard Accessibility & Focus:**
   - Can the user traverse all inputs, buttons, and links sequentially using the `Tab` key?
   - Is there a visible focus outline on the currently active interactive element?
   - Does pressing `Enter` submit single-form inputs predictably?

---

## 4. IA-04: Feedback & State (System Communication & Integrity)

### Objective
Ensure that the interface continuously informs the user about ongoing background processes, operational outcomes, system state transitions, and dangerous mutations.

### Core Heuristic Checkpoints
1. **Processing & Loading States:**
   - Does the UI display loading spinners, disabled button states, or skeleton screens during asynchronous network requests?
   - Are buttons disabled during request inflight to prevent double-click duplicate submissions?
2. **Outcome Feedback (Toasts, Alerts & Banners):**
   - Are operational successes and failures reported through non-blocking, modern notification toasts rather than modal browser `window.alert()`?
   - Do error messages explain *why* an action failed and what corrective action the user should take?
3. **State Machine Integrity & Badges:**
   - Are status badges visually distinctive with semantic color coding (e.g., `pending`: yellow/amber, `confirmed`: indigo, `shipping`: blue, `delivered`: green, `canceled`: gray/red)?
   - Does the UI strictly respect the underlying domain state machine (e.g., a `canceled` order must NEVER offer a direct "Mark as Delivered" button)?
4. **Destructive Action Confirmation:**
   - Do dangerous, irreversible actions (e.g., deleting a coupon, purging catalog data) trigger a modal confirmation dialog (`"Are you sure?"`) before executing the API request?
5. **State Synchronization:**
   - After updating or deleting an entity, does the parent table refresh immediately with authentic backend data, without corrupting sibling records (e.g., avoiding mass-mutation UI bugs)?
