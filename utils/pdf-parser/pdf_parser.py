#!/usr/bin/env python3.9

import argparse
import json
import re
import sys
from typing import Union

import PyPDF2
from pydantic import BaseModel


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', '-f', action='append', default=[], required=True)
    parser.add_argument('--salescode', '-s', required=False, default=None)
    return parser.parse_args()


class CodeDetails(BaseModel):
    code: str
    family: str
    desc: str

code_info: list[str] = []
columns: list[Union[CodeDetails, None]] = [None, None, None]
column = 0
sales_codes: list[CodeDetails] = []
def sales_code_visitor(text: str, cm: list[float], tm: list[float], fontDict: dict[str,str], fontSize: float) -> None:
    global code_info
    global columns
    global column
    global sales_codes

    # Ignore header, footer, empty space
    if tm[5] < 100 or tm[5] > 440 or re.match(r"^\s*$", text):
        return

    code_info.append(text)

    if len(text) > 5:
        if len(code_info) == 3:
            columns[column] = CodeDetails(code=code_info[0], family=code_info[1], desc=code_info[2])
        elif len(code_info) == 2:
            columns[column] = CodeDetails(code=columns[column].code, family=code_info[0], desc=code_info[1])
        else:
            print("Did not capture code or family: ", code_info, file=sys.stderr)

        if columns[column].family in ['$$', 'D2']:
            sales_codes.append(columns[column])

        column = (column + 1) % 3
        code_info = []


def get_sales_codes(filename: str) -> dict[str, str]:
    global sales_codes

    reader = PyPDF2.PdfFileReader(filename)

    codes: dict[str, str] = {}

    for page_num in range(1, reader.numPages):
        reader.pages[page_num].extract_text(visitor_text=sales_code_visitor)

    return dict([(c.code, c.desc) for c in sales_codes])

def get_codes(filename: str) -> dict[str, str]:
    reader = PyPDF2.PdfFileReader(filename)

    codes: dict[str, str] = {}

    for line in reader.pages[0].extract_text().split('\n'):
        m = re.match(r'^(.*?) (\w\d\d\w\d\d) \d+$', line)
        if m:
            codes[m.group(2)] = m.group(1)

    for page_num in range(1, reader.numPages):
        for line in reader.pages[page_num].extract_text().split('\n'):
            line = re.sub(r'^\+ ', '', line)
            m = re.match(r'^(.*?) \((.*?)\)', line)
            if m:
                codes[m.group(2)] = m.group(1)

    return codes

def main() -> int:
    args = arguments()

    codes: dict[str, str] = {}
    for file in args.file:
        c = get_codes(file)
        for k in c.keys():
            desc = c[k].encode("ascii", "ignore").decode()
            if k in codes and desc.lower() not in codes[k].lower():
                codes[k] = ", ".join([codes[k], desc])
            else:
                codes[k] = desc

    if args.salescode:
        c = get_sales_codes(args.salescode)

        for k in c.keys():
            desc = c[k].encode("ascii", "ignore").decode()
            if k in codes and desc.lower() not in codes[k].lower():
                codes[k] = ", ".join([codes[k], desc])
            else:
                codes[k] = desc

        # codes.update(get_codes(file))

    print(json.dumps(codes, sort_keys=True, indent=2))

    return 0

if __name__ == "__main__":
    sys.exit(main())
