# Standard 7-Column GUI Test Checklist Template

## Metadata
- **Project / SUT:** [System Under Test Name]
- **Target URL / Environment:** [e.g., http://localhost:5174]
- **Tester / Evaluator:** [Tester Name / Student ID]
- **Execution Date:** [YYYY-MM-DD]
- **Total Checkpoints:** [Count] | **Passed:** [Count] | **Failed:** [Count]

---

## Checklist Matrix

| Check ID | Screen / Tab | Aspect (IA) | Checkpoint | Expected Outcome | Status (Pass / Fail) | Notes / Defect ID |
|:---:|:---|:---:|:---|:---|:---:|:---|
| `CHK-01` | [Screen / Tab Name] | `IA-01` | [Specific UI standard item to check] | [Exact expected visual outcome] | Pass | |
| `CHK-02` | [Screen / Tab Name] | `IA-02` | [Specific form validation or input behavior] | [Expected feedback or constraint enforcement] | Fail | [Defect ID, e.g. BUG-01: Reason for failure] |
| `CHK-03` | [Screen / Tab Name] | `IA-03` | [Navigation, tab order, or action placement] | [Expected routing or interaction focus] | Pass | |
| `CHK-04` | [Screen / Tab Name] | `IA-04` | [State transition, loading indicator, or toast] | [Expected state visual badge or message] | Fail | [Defect ID, e.g. BUG-02: Reason for failure] |

---

## Instructions for Execution:
1. Every checkpoint must belong to one of the 4 Interface Aspects (`IA-01`, `IA-02`, `IA-03`, `IA-04`).
2. Mark status strictly as `Pass` or `Fail` (do not use ambiguous values like `N/A` or `Pass*` without justification).
3. For every `Fail` item, document the root failure reason in `Notes / Defect ID` and attach an authentic raw screenshot following Rule 9.
