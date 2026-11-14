#!/usr/bin/env python3
"""
GUI Test Checklist Markdown to Excel Exporter
=============================================
This script parses a standardized 7-column GUI Test Checklist written in Markdown
and transforms it into a polished, production-grade Excel workbook (.xlsx).

Features:
- Extracts 7-column tables adhering to the `gui-checklist-tester` schema.
- Applies professional styling: corporate dark blue header, thin borders,
  auto-adjusted column widths, and cell text wrapping.
- Semantic conditional styling for status cells:
  * Pass: Light green background with dark green bold text.
  * Fail: Soft coral/red background with dark red bold text.
- Supports command-line execution with customizable input and output paths.

Usage:
    python export_to_excel.py --input path/to/checklist.md --output path/to/checklist.xlsx
"""

import argparse
import os
import re
import sys
from typing import List, Dict, Any, Optional

try:
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
except ImportError:
    print(
        "Error: 'openpyxl' library is required to run this script. "
        "Please install it using: pip install openpyxl",
        file=sys.stderr,
    )
    sys.exit(1)


def parse_markdown_table(file_path: str) -> List[Dict[str, str]]:
    """
    Parses a Markdown file to extract rows from the standardized 7-column checklist table.

    Expected table headers:
    Check ID | Screen / Tab | Aspect (IA) | Checkpoint | Expected Outcome | Status (Pass / Fail) | Notes / Defect ID

    Args:
        file_path (str): Path to the Markdown checklist file.

    Returns:
        List[Dict[str, str]]: A list of dictionaries representing checklist rows.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"Input file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    rows: List[Dict[str, str]] = []
    header_found = False
    in_table = False

    for line in lines:
        stripped = line.strip()
        if not stripped.startswith("|") or not stripped.endswith("|"):
            if in_table and len(rows) > 0:
                # Table ended
                break
            continue

        # Extract cell contents
        cells = [c.strip() for c in stripped.split("|")[1:-1]]

        # Detect header row
        if not header_found:
            lower_cells = [c.lower() for c in cells]
            if any("check id" in c or "id" in c for c in lower_cells) and any("aspect" in c or "checkpoint" in c for c in lower_cells):
                header_found = True
                continue

        # Skip separator line (e.g., |:---:|:---|...)
        if header_found and all(re.match(r"^:?-+:?$", c) for c in cells):
            in_table = True
            continue

        # Process data rows
        if in_table and len(cells) >= 7:
            # Clean backticks and inline markdown formatting from cell content
            clean_cells = [re.sub(r"`([^`]+)`", r"\1", c) for c in cells]
            
            row_data = {
                "check_id": clean_cells[0],
                "screen_tab": clean_cells[1],
                "aspect": clean_cells[2],
                "checkpoint": clean_cells[3],
                "expected_outcome": clean_cells[4],
                "status": clean_cells[5],
                "notes": clean_cells[6] if len(clean_cells) > 6 else "",
            }
            rows.append(row_data)

    return rows


def create_excel_workbook(rows: List[Dict[str, str]], output_path: str) -> None:
    """
    Generates a beautifully styled Excel spreadsheet from parsed checklist data.

    Args:
        rows (List[Dict[str, str]]): List of row data dictionaries.
        output_path (str): Destination path for the .xlsx file.
    """
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "GUI Checklist"

    # Ensure grid lines are visible
    ws.views.sheetView[0].showGridLines = True

    # Define Styles
    header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1F4E79", end_color="1F4E79", fill_type="solid")  # Corporate dark blue
    header_alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    data_font = Font(name="Segoe UI", size=10, color="000000")
    bold_data_font = Font(name="Segoe UI", size=10, bold=True, color="000000")

    # Status formatting
    pass_fill = PatternFill(start_color="E2EFDA", end_color="E2EFDA", fill_type="solid")  # Soft light green
    pass_font = Font(name="Segoe UI", size=10, bold=True, color="375623")  # Forest green

    fail_fill = PatternFill(start_color="FCE4D6", end_color="FCE4D6", fill_type="solid")  # Soft light coral/red
    fail_font = Font(name="Segoe UI", size=10, bold=True, color="C00000")  # Dark red

    # Borders
    thin_border_side = Side(style="thin", color="D9D9D9")
    cell_border = Border(
        left=thin_border_side,
        right=thin_border_side,
        top=thin_border_side,
        bottom=thin_border_side,
    )
    header_border_side = Side(style="medium", color="1F4E79")
    header_border = Border(
        left=thin_border_side,
        right=thin_border_side,
        top=header_border_side,
        bottom=header_border_side,
    )

    # Alignments
    center_align = Alignment(horizontal="center", vertical="center")
    left_wrap_align = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # Write Headers
    headers = [
        "Check ID",
        "Screen / Tab",
        "Aspect (IA)",
        "Checkpoint",
        "Expected Outcome",
        "Status (Pass / Fail)",
        "Notes / Defect ID",
    ]

    ws.append(headers)
    ws.row_dimensions[1].height = 28

    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment
        cell.border = header_border

    # Write Data Rows
    for row_idx, row_data in enumerate(rows, start=2):
        ws.row_dimensions[row_idx].height = 40  # Ample row height for wrapped text
        
        status_val = row_data["status"].strip()
        status_normalized = status_val.lower()

        cells_values = [
            row_data["check_id"],
            row_data["screen_tab"],
            row_data["aspect"],
            row_data["checkpoint"],
            row_data["expected_outcome"],
            status_val,
            row_data["notes"],
        ]

        ws.append(cells_values)

        # Style individual cells in the row
        for col_idx in range(1, len(cells_values) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = cell_border
            cell.font = data_font

            # Check ID
            if col_idx == 1:
                cell.alignment = center_align
                cell.font = bold_data_font
            # Screen / Tab
            elif col_idx == 2:
                cell.alignment = left_wrap_align
            # Aspect (IA)
            elif col_idx == 3:
                cell.alignment = center_align
                cell.font = bold_data_font
            # Checkpoint & Expected Outcome
            elif col_idx in (4, 5):
                cell.alignment = left_wrap_align
            # Status column
            elif col_idx == 6:
                cell.alignment = center_align
                if "pass" in status_normalized:
                    cell.fill = pass_fill
                    cell.font = pass_font
                elif "fail" in status_normalized:
                    cell.fill = fail_fill
                    cell.font = fail_font
                else:
                    cell.alignment = center_align
            # Notes / Defect ID
            elif col_idx == 7:
                cell.alignment = left_wrap_align
                if status_normalized == "fail" and cell.value:
                    cell.font = bold_data_font

    # Set column widths
    column_width_map = {
        1: 14,  # Check ID
        2: 24,  # Screen / Tab
        3: 16,  # Aspect (IA)
        4: 45,  # Checkpoint
        5: 45,  # Expected Outcome
        6: 22,  # Status (Pass / Fail)
        7: 35,  # Notes / Defect ID
    }

    for col_idx, width in column_width_map.items():
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = width

    # Ensure parent output directory exists
    output_dir = os.path.dirname(os.path.abspath(output_path))
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    # Save workbook
    wb.save(output_path)
    print(f"Successfully exported {len(rows)} checklist items to Excel: {output_path}")


def main() -> None:
    """CLI Entrypoint for the checklist exporter."""
    parser = argparse.ArgumentParser(
        description="Convert Markdown GUI Test Checklist to professional Excel (.xlsx)."
    )
    parser.add_argument(
        "--input",
        "-i",
        required=True,
        help="Path to the input Markdown checklist file (.md).",
    )
    parser.add_argument(
        "--output",
        "-o",
        required=True,
        help="Path to the output Excel file (.xlsx).",
    )

    args = parser.parse_args()

    try:
        print(f"Parsing Markdown checklist from: {args.input}")
        rows = parse_markdown_table(args.input)
        if not rows:
            print("Warning: No checklist rows were found in the provided Markdown file.", file=sys.stderr)
            sys.exit(1)

        print(f"Found {len(rows)} valid checklist entries. Formatting Excel workbook...")
        create_excel_workbook(rows, args.output)
    except Exception as e:
        print(f"Error during export: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
