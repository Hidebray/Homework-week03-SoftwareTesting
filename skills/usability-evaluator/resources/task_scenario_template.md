# Goal-Oriented Task Scenario Specification & Evaluation Rubric

This resource defines the standardized schema for constructing open-ended, goal-oriented task scenarios for usability evaluations, along with concrete evaluation rubrics and reference scenarios tailored for e-commerce back-office systems.

---

## 1. Goal-Oriented Scenario Engineering Schema

Every task scenario presented to a participant must be structured according to the following 6-part schema:

```text
================================================================================
TASK SCENARIO ID: [TS-XX]
TITLE: [Concise Business Task Name]
TARGET MODULE / VIEW: [E.g., Products Catalog, Order Management]
================================================================================
1. USER PERSONA:
   [Real-world professional role, e.g., Junior Store Admin, Inventory Clerk]

2. BUSINESS CONTEXT & MOTIVATION:
   [Realistic narrative explaining WHY this task must be performed today]

3. USER-FACING GOAL (PRINTED ON TASK CARD):
   [Open-ended, actionable instruction. STRICTLY PROHIBITS naming UI elements]

4. REFERENCE INPUT DATA:
   [Structured data inputs provided on a printed reference sheet or digital scratchpad]

5. SUCCESS CRITERIA:
   - Success (100%): [Objective condition indicating flawless completion]
   - Partial Success (50%): [Condition indicating completed goal with hesitation/assistance]
   - Failed (0%): [Condition indicating failure, incorrect outcome, or abandonment]

6. STOPPING RULE:
   - Maximum Duration: 180 seconds (3 minutes)
   - Fallback Action: Moderator intervenes politely and advances to next scenario
================================================================================
```

---

## 2. Evaluation Rubric & Metric Definitions

During execution, the moderator scores the participant against standardized metric definitions:

| Metric | Level | Operational Definition | Quantitative Score |
|:---|:---:|:---|:---:|
| **Completion Status** | **Success** | The participant achieves the exact business outcome independently within $\le 180$ seconds without requiring any assistance or verbal hints from the moderator. | **1.0** (100%) |
| | **Partial Success** | The participant achieves the business outcome within $\le 180$ seconds, but required a neutral re-reading of the goal, wandered into irrelevant menus, or made an initial unforced error before recovering. | **0.5** (50%) |
| | **Failed** | The participant exceeded the 180-second threshold, gave up in frustration, performed an unrecoverable destructive action, or corrupted database state. | **0.0** (0%) |
| **Time-on-Task (ToT)** | Continuous | Recorded in exact seconds from the moment the participant finishes reading the task card until they announce task completion or reach the 180s threshold. | Seconds ($0 - 180$) |
| **Friction Level** | Low | Seamless flow, no observable hesitation $>5$s. | 1 |
| | Medium | Noticeable hesitation ($5 - 15$s), 1-2 misclicks, re-reading labels. | 2 |
| | High | Severe cognitive freeze ($>15$s), verbal confusion, repetitive cyclic clicks. | 3 |

---

## 3. Concrete Reference Scenarios (EShop Web Admin)

### Scenario 1 (TS-01): Catalog Product Registration & Inventory Setup
- **Target View:** Products & CSV Import View (`frontend-admin`)
- **Persona:** Inventory Associate
- **Context:** Your store just received a shipment of summer apparel. You must add the new item to the store catalog so customers can purchase it.
- **Goal Statement (User-Facing Card):**
  > *"You need to add a new clothing item to the store catalog. The product is named **'Áo Polo Thể Thao'**, belongs to the **'Thời trang'** category, and has a retail price of **180,000 VND**. Please make sure it appears in the active catalog listing."*
- **Reference Data:**
  - Name: `Áo Polo Thể Thao`
  - Category: `Thời trang`
  - Price: `180000`
- **Success Criteria:** Product is persisted and rendered as a visible row in the products table.
- **Known Friction / Bug Trigger:** Inconsistent CTA colors (Green save button vs Blue/Orange elsewhere), unformatted price display (`180000 ₫` without thousands separator), adjacent Edit/Delete buttons.

---

### Scenario 2 (TS-02): Bulk Inventory Sync via CSV File
- **Target View:** Products & CSV Import View (`frontend-admin`)
- **Persona:** Inventory Manager
- **Context:** The supplier sent a CSV batch file containing new seasonal items. You need to verify the template and import the file into the store catalog.
- **Goal Statement (User-Facing Card):**
  > *"Your supplier sent you an inventory CSV batch. First, download the official sample template from the system to verify the expected column layout. Then, upload the file **'batch_products.csv'** from your desktop into the system."*
- **Reference Data:** Sample CSV file `batch_products.csv` prepared in workspace.
- **Success Criteria:** User successfully downloads `template.csv` and uploads the batch file without format rejection.
- **Known Friction / Bug Trigger:** Input lacks `accept=".csv"` filter, naive CSV split comma parser breaks if descriptions contain commas (`split(',')`).

---

### Scenario 3 (TS-03): Flash Sale Coupon Creation & Restriction Rules
- **Target View:** Coupons View (`frontend-admin`)
- **Persona:** Marketing Specialist
- **Context:** An upcoming Flash Sale campaign requires a promotional code offering 15% off for high-value orders.
- **Goal Statement (User-Facing Card):**
  > *"Please set up a promotional coupon code named **'SUMMER15'** that grants customers a **15% discount**. To prevent store losses, the coupon must only apply to orders of at least **250,000 VND** and should expire on **December 31, 2026**."*
- **Reference Data:**
  - Code: `SUMMER15`
  - Type: Percentage (`15%`)
  - Min Order Amount: `250000`
  - Max Uses Per User: `1`
  - Expiry Date: `2026-12-31`
- **Success Criteria:** Coupon is created and appears in the active promotional coupons table with code `SUMMER15`.
- **Known Friction / Bug Trigger:** React state `{ min_order_amount: 0, max_uses_per_user: 1 }` obliterates placeholders, form lacks `<label>` tags (user sees naked `0` and `1` inputs without labels), static "Giá trị" label lacks `%` or `₫` indicator.

---

### Scenario 4 (TS-04): Order Processing, Fulfillment & Customer Delivery
- **Target View:** Orders View (`frontend-admin`)
- **Persona:** Fulfillment & Dispatch Officer
- **Context:** Customers are waiting for their purchases. You must review incoming customer orders and advance the earliest pending order through fulfillment to final delivery.
- **Goal Statement (User-Facing Card):**
  > *"Review the customer orders list. Find the first pending order in the queue, confirm it for processing, update its fulfillment status to shipping, and finally mark it as successfully delivered to the customer."*
- **Success Criteria:** Targeted order reaches the `delivered` status badge (green) without accidental cancellation.
- **Known Friction / Bug Trigger:** Undersized action buttons (`text-xs`), adjacent "Xác nhận" and "Hủy" buttons with no buffer space (accidental cancellation risk), blank white area when order list is empty (missing Empty State).
