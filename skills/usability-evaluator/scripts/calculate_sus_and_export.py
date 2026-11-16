#!/usr/bin/env python3
"""
System Usability Scale (SUS) Calculator & Excel Scoring Matrix Generator
========================================================================
This script processes participant responses to the 10-item System Usability Scale
(Brooke, 1986), computes normalized item contributions and individual SUS scores,
calculates descriptive statistics (Mean, Std Dev, Min, Max), assigns Sauro-Lewis
curved grades, and exports an executive-grade Excel workbook (.xlsx).

Features:
- Standard John Brooke (1986) normalization:
  * Odd items (1, 3, 5, 7, 9): Contribution = X_i - 1
  * Even items (2, 4, 6, 8, 10): Contribution = 5 - X_i
  * Individual SUS Score = sum(Contributions) * 2.5
- Descriptive summary statistics using Excel formulas (=AVERAGE, =STDEV.S, =MIN, =MAX).
- Sauro-Lewis (2012) curved grading benchmarks (A, B, C, D, F) with acceptability ratings.
- Executive corporate styling: Navy header (#1F4E79), Segoe UI typography, thin borders,
  semantic conditional cell fills, and auto-adjusted column widths.
- Embedded Sauro-Lewis benchmark reference sheet for academic and auditing compliance.

Usage:
    python calculate_sus_and_export.py --input path/to/sus_data.json --output usability/04_sus_scoring_matrix.xlsx
"""

import argparse
import json
import math
import os
import sys
from typing import List, Dict, Any, Tuple

try:
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
except ImportError:
    print(
        "Error: 'openpyxl' library is required. Please install it using: pip install openpyxl",
        file=sys.stderr,
    )
    sys.exit(1)


# ==============================================================================
# DEFAULT / BENCHMARK PARTICIPANT DATA (7 Target Real Users + 1 Pilot)
# ==============================================================================
DEFAULT_PARTICIPANTS = [
    {
        "participant_id": "P00 (Pilot)",
        "demographics": "Đinh Thị Thảo (28t, Hành chính)",
        "masked_contact": "091****882",
        "q_scores": [3, 4, 2, 4, 3, 4, 3, 4, 2, 4],  # Initial pilot run
        "is_pilot": True,
    },
    {
        "participant_id": "P01",
        "demographics": "Nguyễn Hữu Tình (21t, Student - Trung bình)",
        "masked_contact": "0868****044",
        "q_scores": [3, 2, 4, 4, 3, 4, 3, 2, 3, 3],
        "is_pilot": False,
    },
    {
        "participant_id": "P02",
        "demographics": "Nguyễn Cao Quốc Huy (21t, Student - Trung bình)",
        "masked_contact": "0817****364",
        "q_scores": [4, 2, 2, 2, 3, 2, 5, 3, 4, 3],
        "is_pilot": False,
    },
    {
        "participant_id": "P03",
        "demographics": "Phan Thị Mỹ Duyên (21t, Student - Cơ bản)",
        "masked_contact": "0981****733",
        "q_scores": [2, 2, 3, 4, 3, 3, 4, 2, 3, 4],
        "is_pilot": False,
    },
    {
        "participant_id": "P04",
        "demographics": "Trần Đình Sỹ (18t, Student - Cơ bản)",
        "masked_contact": "0356****496",
        "q_scores": [2, 3, 3, 2, 3, 2, 4, 3, 4, 2],
        "is_pilot": False,
    },
    {
        "participant_id": "P05",
        "demographics": "Trần Thị Mỹ Linh (25t, Y Dược - Cơ bản)",
        "masked_contact": "0942****067",
        "q_scores": [2, 3, 2, 3, 2, 3, 4, 3, 3, 3],
        "is_pilot": False,
    },
    {
        "participant_id": "P06",
        "demographics": "Nguyễn Quốc Duy (21t, Student - Trung bình)",
        "masked_contact": "0379****910",
        "q_scores": [3, 2, 4, 2, 4, 3, 4, 2, 4, 2],
        "is_pilot": False,
    },
    {
        "participant_id": "P07",
        "demographics": "Nguyễn Mạnh Hiền (21t, Student - Trung bình)",
        "masked_contact": "0865****517",
        "q_scores": [2, 3, 4, 2, 2, 3, 4, 2, 4, 2],
        "is_pilot": False,
    },
]

SUS_QUESTIONS = [
    "Q01: Want to use frequently (+)",
    "Q02: Unnecessarily complex (-)",
    "Q03: Thought system easy to use (+)",
    "Q04: Need technical support (-)",
    "Q05: Functions well integrated (+)",
    "Q06: Too much inconsistency (-)",
    "Q07: Learn to use quickly (+)",
    "Q08: Found system cumbersome (-)",
    "Q09: Felt very confident (+)",
    "Q10: Need to learn a lot (-)",
]


def calculate_sus_score(raw_scores: List[int]) -> Tuple[List[int], float]:
    """
    Computes normalized item contributions and overall SUS score using John Brooke (1986).

    Args:
        raw_scores: List of 10 integers (1 to 5).

    Returns:
        Tuple containing list of 10 normalized scores (0 to 4) and total SUS score (0 to 100).
    """
    if len(raw_scores) != 10:
        raise ValueError(f"Expected 10 raw scores, got {len(raw_scores)}")

    normalized = []
    for idx, score in enumerate(raw_scores):
        if idx % 2 == 0:  # Odd items: Q01, Q03, Q05, Q07, Q09 (0-indexed: 0, 2, 4, 6, 8)
            norm = score - 1
        else:             # Even items: Q02, Q04, Q06, Q08, Q10 (0-indexed: 1, 3, 5, 7, 9)
            norm = 5 - score
        normalized.append(norm)

    total_sus = sum(normalized) * 2.5
    return normalized, total_sus


def get_sauro_lewis_grade(sus_score: float) -> Tuple[str, str, str]:
    """
    Assigns Sauro-Lewis (2012) curved letter grade and acceptability rating.

    Returns:
        Tuple: (Grade, Adjective, Acceptability)
    """
    if sus_score >= 80.3:
        return ("Grade A", "Excellent / Best Imaginable", "Acceptable")
    elif sus_score >= 68.1:
        return ("Grade B", "Good / Above Average", "Acceptable")
    elif sus_score == 68.0:
        return ("Grade C", "Industry Average Baseline", "Marginal")
    elif sus_score >= 51.0:
        return ("Grade D / C-", "Marginal / Below Average", "Marginal")
    else:
        return ("Grade F", "Poor / Unacceptable", "Not Acceptable")


def create_sus_workbook(participants: List[Dict[str, Any]], output_path: str):
    """
    Generates a production-grade Excel workbook containing raw scores,
    normalized contributions, computed SUS scores, formulas, and benchmarks.
    """
    wb = openpyxl.Workbook()

    # Define color palette & styles
    NAVY_HEADER = "1F4E79"
    SOFT_BLUE = "D9E1F2"
    ZEBRA_FILL = "F9FBFD"
    WHITE = "FFFFFF"
    BORDER_GRAY = "D3D3D3"
    GREEN_FILL = "E2EFDA"
    GREEN_TEXT = "375623"
    AMBER_FILL = "FFF2CC"
    AMBER_TEXT = "833C0C"
    RED_FILL = "FCE4D6"
    RED_TEXT = "C65911"

    font_title = Font(name="Segoe UI", size=14, bold=True, color="1F4E79")
    font_subtitle = Font(name="Segoe UI", size=10, italic=True, color="595959")
    font_header = Font(name="Segoe UI", size=10, bold=True, color=WHITE)
    font_sub_header = Font(name="Segoe UI", size=9, bold=True, color="1F4E79")
    font_data = Font(name="Segoe UI", size=10)
    font_bold = Font(name="Segoe UI", size=10, bold=True)
    font_formula = Font(name="Segoe UI", size=10, bold=True, color="1F4E79")

    fill_header = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type="solid")
    fill_sub_header = PatternFill(start_color=SOFT_BLUE, end_color=SOFT_BLUE, fill_type="solid")
    fill_zebra = PatternFill(start_color=ZEBRA_FILL, end_color=ZEBRA_FILL, fill_type="solid")
    fill_white = PatternFill(start_color=WHITE, end_color=WHITE, fill_type="solid")

    thin_border = Border(
        left=Side(style="thin", color=BORDER_GRAY),
        right=Side(style="thin", color=BORDER_GRAY),
        top=Side(style="thin", color=BORDER_GRAY),
        bottom=Side(style="thin", color=BORDER_GRAY),
    )
    double_bottom_border = Border(
        left=Side(style="thin", color=BORDER_GRAY),
        right=Side(style="thin", color=BORDER_GRAY),
        top=Side(style="thin", color=BORDER_GRAY),
        bottom=Side(style="double", color="1F4E79"),
    )

    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")
    align_right = Alignment(horizontal="right", vertical="center")

    # -------------------------------------------------------------------------
    # SHEET 1: SUS Scoring Matrix
    # -------------------------------------------------------------------------
    ws1 = wb.active
    ws1.title = "SUS Scoring Matrix"
    ws1.views.sheetView[0].showGridLines = True

    # Title Block
    ws1["A1"] = "SYSTEM USABILITY SCALE (SUS) EVALUATION MATRIX"
    ws1["A1"].font = font_title
    ws1["A2"] = "SUT: EShop Web Admin (frontend-admin) | Methodology: John Brooke (1986) & Sauro-Lewis (2012)"
    ws1["A2"].font = font_subtitle

    # Table Header Rows (Row 4 & 5)
    # 1. Vertical merges for individual columns
    for col_idx, col_name in [
        (1, "User ID"),
        (2, "Demographics / Role"),
        (3, "Masked Contact"),
        (24, "Sum (0-40)"),
        (25, "SUS Score (0-100)"),
        (26, "Sauro-Lewis Grade"),
        (27, "Acceptability"),
    ]:
        col_letter = get_column_letter(col_idx)
        ws1[f"{col_letter}4"] = col_name
        ws1.merge_cells(f"{col_letter}4:{col_letter}5")

    # 2. Horizontal merges for question groups in Row 4
    ws1["D4"] = "Raw Item Responses (Scale: 1 = Strongly Disagree to 5 = Strongly Agree)"
    ws1.merge_cells("D4:M4")

    ws1["N4"] = "Normalized Score Contributions (Odd: Xi-1 | Even: 5-Xi)"
    ws1.merge_cells("N4:W4")

    for col in range(1, 28):
        cell = ws1.cell(row=4, column=col)
        cell.fill = fill_header
        cell.font = font_header
        cell.alignment = align_center
        cell.border = thin_border

    # Subheaders for questions in Row 5
    for i in range(1, 11):
        # Raw questions (Cols D to M)
        c_raw = ws1.cell(row=5, column=3 + i, value=f"Q{i:02d}")
        c_raw.fill = fill_sub_header
        c_raw.font = font_sub_header
        c_raw.alignment = align_center
        c_raw.border = thin_border

        # Normalized questions (Cols N to W)
        c_norm = ws1.cell(row=5, column=13 + i, value=f"S{i:02d}")
        c_norm.fill = fill_sub_header
        c_norm.font = font_sub_header
        c_norm.alignment = align_center
        c_norm.border = thin_border

    # Fill and border for row 5 merged columns
    for c in [1, 2, 3, 24, 25, 26, 27]:
        cell = ws1.cell(row=5, column=c)
        cell.fill = fill_header
        cell.border = thin_border

    # Populate Participant Rows (Row 6 onwards)
    current_row = 6
    primary_participants = [p for p in participants if not p.get("is_pilot", False)]
    all_rows = participants

    for p in all_rows:
        raw_q = p["q_scores"]
        norm_q, sus_score = calculate_sus_score(raw_q)
        grade, adj, accept = get_sauro_lewis_grade(sus_score)

        row_fill = fill_zebra if current_row % 2 == 0 else fill_white

        # Col A, B, C
        ws1.cell(row=current_row, column=1, value=p["participant_id"]).alignment = align_center
        ws1.cell(row=current_row, column=2, value=p["demographics"]).alignment = align_left
        ws1.cell(row=current_row, column=3, value=p["masked_contact"]).alignment = align_center

        # Cols D to M (Raw Responses)
        for i in range(10):
            c = ws1.cell(row=current_row, column=4 + i, value=raw_q[i])
            c.alignment = align_center

        # Cols N to W (Normalized Contributions using Excel Formulas)
        # Odd: =D{row}-1, Even: =5-E{row}
        for i in range(10):
            raw_col_letter = get_column_letter(4 + i)
            if i % 2 == 0:
                formula = f"={raw_col_letter}{current_row}-1"
            else:
                formula = f"=5-{raw_col_letter}{current_row}"
            c = ws1.cell(row=current_row, column=14 + i, value=formula)
            c.alignment = align_center

        # Col X: Sum of normalized (N to W)
        c_sum = ws1.cell(row=current_row, column=24, value=f"=SUM(N{current_row}:W{current_row})")
        c_sum.alignment = align_center
        c_sum.font = font_bold

        # Col Y: SUS Score = Sum * 2.5
        c_sus = ws1.cell(row=current_row, column=25, value=f"=X{current_row}*2.5")
        c_sus.alignment = align_center
        c_sus.font = font_bold
        c_sus.number_format = "0.0"

        # Col Z & AA: Grade and Acceptability
        c_grade = ws1.cell(row=current_row, column=26, value=grade)
        c_grade.alignment = align_center
        c_grade.font = font_bold

        c_acc = ws1.cell(row=current_row, column=27, value=accept)
        c_acc.alignment = align_center

        # Semantic cell coloring for outcomes
        if "Grade A" in grade or "Grade B" in grade:
            c_sus.fill = PatternFill(start_color=GREEN_FILL, end_color=GREEN_FILL, fill_type="solid")
            c_grade.fill = PatternFill(start_color=GREEN_FILL, end_color=GREEN_FILL, fill_type="solid")
            c_grade.font = Font(name="Segoe UI", size=10, bold=True, color=GREEN_TEXT)
        elif "Grade F" in grade:
            c_sus.fill = PatternFill(start_color=RED_FILL, end_color=RED_FILL, fill_type="solid")
            c_grade.fill = PatternFill(start_color=RED_FILL, end_color=RED_FILL, fill_type="solid")
            c_grade.font = Font(name="Segoe UI", size=10, bold=True, color=RED_TEXT)
        else:
            c_sus.fill = PatternFill(start_color=AMBER_FILL, end_color=AMBER_FILL, fill_type="solid")
            c_grade.fill = PatternFill(start_color=AMBER_FILL, end_color=AMBER_FILL, fill_type="solid")
            c_grade.font = Font(name="Segoe UI", size=10, bold=True, color=AMBER_TEXT)

        # Apply borders and fonts across row
        for col_idx in range(1, 28):
            cell = ws1.cell(row=current_row, column=col_idx)
            cell.border = thin_border
            if col_idx not in [24, 25, 26]:
                cell.font = font_data
            if cell.fill.fill_type is None:
                cell.fill = row_fill

        current_row += 1

    # Statistical Summary Rows (Excluding Pilot P00 if present)
    pilot_offset = 1 if any(p.get("is_pilot") for p in participants) else 0
    start_row = 6 + pilot_offset
    end_row = current_row - 1

    summary_labels = [
        ("COHORT MEAN (N=7)", f"=AVERAGE(Y{start_row}:Y{end_row})"),
        ("STANDARD DEVIATION", f"=STDEV.S(Y{start_row}:Y{end_row})"),
        ("MINIMUM SCORE", f"=MIN(Y{start_row}:Y{end_row})"),
        ("MAXIMUM SCORE", f"=MAX(Y{start_row}:Y{end_row})"),
        ("INDUSTRY BASELINE", "68.0"),
    ]

    for label, formula in summary_labels:
        ws1.merge_cells(f"A{current_row}:X{current_row}")
        c_label = ws1.cell(row=current_row, column=1, value=label)
        c_label.alignment = align_right
        c_label.font = font_formula
        c_label.fill = fill_sub_header

        c_val = ws1.cell(row=current_row, column=25, value=formula)
        c_val.alignment = align_center
        c_val.font = font_formula
        c_val.fill = fill_sub_header
        c_val.number_format = "0.0"

        # Overall Benchmark indicator for Cohort Mean
        if label == "COHORT MEAN (N=7)":
            c_grade = ws1.cell(row=current_row, column=26, value="Curved Grade")
            c_grade.font = font_formula
            c_grade.alignment = align_center
            c_grade.fill = fill_sub_header

            c_eval = ws1.cell(row=current_row, column=27, value="vs 68.0 Baseline")
            c_eval.font = font_formula
            c_eval.alignment = align_center
            c_eval.fill = fill_sub_header
        else:
            ws1.cell(row=current_row, column=26).fill = fill_sub_header
            ws1.cell(row=current_row, column=27).fill = fill_sub_header

        for col_idx in range(1, 28):
            border_style = double_bottom_border if label == "INDUSTRY BASELINE" else thin_border
            ws1.cell(row=current_row, column=col_idx).border = border_style

        current_row += 1

    # Auto-fit column widths
    for col in ws1.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            # Skip title row and merged rows when measuring
            if cell.row in [1, 2, 4] or (cell.row >= current_row - 5 and cell.column < 25):
                continue
            val_str = str(cell.value or "")
            if len(val_str) > max_len:
                max_len = len(val_str)
        ws1.column_dimensions[col_letter].width = max(max_len + 3, 7)

    ws1.column_dimensions["A"].width = 14
    ws1.column_dimensions["B"].width = 28
    ws1.column_dimensions["C"].width = 16
    ws1.column_dimensions["Y"].width = 18
    ws1.column_dimensions["Z"].width = 18
    ws1.column_dimensions["AA"].width = 18

    # -------------------------------------------------------------------------
    # SHEET 2: Sauro-Lewis Benchmark Guide
    # -------------------------------------------------------------------------
    ws2 = wb.create_sheet(title="Sauro-Lewis Benchmarks")
    ws2.views.sheetView[0].showGridLines = True

    ws2["A1"] = "SAURO-LEWIS (2012) CURVED GRADING SCALE REFERENCE"
    ws2["A1"].font = font_title
    ws2["A2"] = "Empirical percentile rankings based on 5,000+ software usability evaluations"
    ws2["A2"].font = font_subtitle

    headers_s2 = ["SUS Score Range", "Curved Grade", "Percentile Rank", "Adjective Rating", "Acceptability", "NPS Category"]
    for col_idx, h in enumerate(headers_s2, start=1):
        c = ws2.cell(row=4, column=col_idx, value=h)
        c.fill = fill_header
        c.font = font_header
        c.alignment = align_center
        c.border = thin_border

    benchmark_data = [
        (">= 80.3", "Grade A", "90th – 100th", "Excellent / Best Imaginable", "Acceptable", "Promoters"),
        ("68.1 – 80.2", "Grade B", "50th – 89th", "Good / Above Average", "Acceptable", "Passives"),
        ("68.0", "Baseline", "50th", "Industry Average Baseline", "Marginal", "Neutral"),
        ("51.0 – 67.9", "Grade C / D", "15th – 49th", "Marginal / Below Average", "Marginal", "Detractors"),
        ("< 51.0", "Grade F", "0 – 14th", "Poor / Worst Imaginable", "Not Acceptable", "Detractors"),
    ]

    for row_idx, row_vals in enumerate(benchmark_data, start=5):
        for col_idx, val in enumerate(row_vals, start=1):
            c = ws2.cell(row=row_idx, column=col_idx, value=val)
            c.border = thin_border
            c.font = font_data
            c.alignment = align_center
            if row_idx % 2 == 0:
                c.fill = fill_zebra

    for col in ws2.columns:
        col_letter = get_column_letter(col[0].column)
        ws2.column_dimensions[col_letter].width = 22

    # Save output
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    wb.save(output_path)
    print(f"Successfully exported SUS Scoring Matrix to: {output_path}")


def load_from_tally_csv(csv_path: str) -> List[Dict[str, Any]]:
    """Loads and formats participant responses directly from Tally export CSV."""
    import csv
    participants = [
        {
            "participant_id": "P00 (Pilot)",
            "demographics": "Đinh Thị Thảo (28t, Hành chính)",
            "masked_contact": "091****882",
            "q_scores": [3, 4, 2, 4, 3, 4, 3, 4, 2, 4],
            "is_pilot": True,
        }
    ]
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = next(reader)
        for idx, row in enumerate(reader, start=1):
            if not row or len(row) < 18:
                continue
            name = row[3].strip()
            age = row[4].strip()
            job = row[5].strip()
            phone = row[6].strip()
            tech = row[7].strip()
            q_scores = [int(x.strip()) for x in row[8:18]]

            clean_phone = phone.replace("+84", "0").replace(" ", "").replace("-", "")
            if len(clean_phone) >= 10:
                masked_phone = clean_phone[:4] + "****" + clean_phone[-3:]
            else:
                masked_phone = phone[:3] + "****" + phone[-3:]

            demo_str = f"{name} ({age}t, {job} - {tech})"
            participants.append({
                "participant_id": f"P{idx:02d}",
                "demographics": demo_str,
                "masked_contact": masked_phone,
                "q_scores": q_scores,
                "is_pilot": False,
            })
    return participants


def main():
    parser = argparse.ArgumentParser(
        description="Calculate System Usability Scale (SUS) scores and export Excel matrix."
    )
    parser.add_argument(
        "--input",
        type=str,
        default="",
        help="Path to JSON or CSV file containing participant responses (optional).",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="usability/04_sus_scoring_matrix.xlsx",
        help="Target output path for the Excel workbook (.xlsx).",
    )

    args = parser.parse_args()

    # Load data
    if args.input and os.path.isfile(args.input):
        print(f"Loading participant data from: {args.input}")
        if args.input.lower().endswith(".csv"):
            participants = load_from_tally_csv(args.input)
        else:
            with open(args.input, "r", encoding="utf-8") as f:
                participants = json.load(f)
    else:
        print("Using standard 7-participant cohort data (+ 1 Pilot session)...")
        participants = DEFAULT_PARTICIPANTS

    create_sus_workbook(participants, args.output)


if __name__ == "__main__":
    main()
