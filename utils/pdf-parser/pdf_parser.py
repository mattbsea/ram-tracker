#!/usr/bin/env python3.9

import argparse
import json
import re
import sys

import PyPDF2


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', '-f', action='append', default=[], required=True)
    return parser.parse_args()


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

    codes = {}
    for file in args.file:
        codes.update(get_codes(file))

    print(json.dumps(codes, sort_keys=True, indent=2))

    return 0

if __name__ == "__main__":
    sys.exit(main())
