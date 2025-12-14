import os
import re
import tempfile
from typing import Iterable, List, Set

from zipfile import ZipFile, BadZipFile

from pypdf import PdfReader
import pandas as pd

from .config import settings
from .models import UploadContext, InputMode

# Have to refine this later for filter domain (Filters, HVAC etc.)
COMPANY_PATTERN = re.compile(
    r"\b([A-Z][A-Za-z0-9&.,\- ]+?"
    r"(?:Pvt\. Ltd\.|Private Limited|Ltd\.|LLP|Industries|Filters|Engineering|"
    r"Technologies|Enterprises|Corporation|Corp\.|Systems|Solutions))\b"
)


def extract_companies_from_text(text: str) -> Set[str]:
    companies: Set[set] = set()
    for match in COMPANY_PATTERN.finditer(text):
        name = " ".join(mactch.group(1).split())
        if len(name) >= 3:
            companies.add(name.strip())
    return companies


def ocr_extract_companies_from_pdf(file_path: str) -> Set[str]:
    """
    OCR fallback hook.
    Phase 3: stub Phase X: Integrate tesseract / external OCR or paid API
    """
    # TODO integrate OCR if needed later
    return set()


def extract_from_pdf(file_path: str) -> Set[str]:
    companies: Set[str] = set()
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            try:
                text = page.extract_text() or ""
            except Exception:
                text = ""
            if text:
                companies |= extract_companies_from_text(text)
    except Exception:
        # If pdf is badly encoded we rely on OCR hook
        pass
    if not companies:
        companies |= ocr_extract_companies_from_pdf(file_path)

    return companies


def extract_from_excel(file_path: str) -> Set[str]:
    companies: Set[str] = set()
    try:
        # Read all sheets
        sheets = pd.read_excel(file_path, sheet_name=None, dtype=str)
    except Exception:
        return companies

    for _sheet_name, df in sheets.items():
        # Only object/string columns
        for value in df.select_dtypes(include=["object"]).values.flatten():
            if not isinstance(value, str):
                continue
            text = value.strip()
            if not text:
                continue
            companies |= extract_companies_from_text(text)

    return companies


def extract_from_zip(file_path: str) -> Set[str]:
    companies: Set[str] = set()
    try:
        with ZipFile(file_path) as zf:
            with tempfile.TemporaryDirectory() as tmpdir:
                for member in zf.namelist():
                    # basic protection: ignore directories
                    if member.endswith("/"):
                        continue

                    lower = member.lower()
                    if not (
                        lower.endswith(".pdf")
                        or lower.endswith(".xlsx")
                        or lower.endswith(".xls")
                    ):
                        continue

                    extracted_path = zf.extract(member, path=tmpdir)

                    if lower.endswith(".pdf"):
                        companies |= extract_from_pdf(extracted_path)
                    elif lower.endswith((".xlsx", ".xls")):
                        companies |= extract_from_excel(extracted_path)

    except BadZipFile:
        return companies
    except Exception:
        return companies

    return companies


def extract_companies_from_uploads(
    upload_context: UploadContext, input_mode: InputMode
) -> List[str]:
    """
    Given upload metadata from Node and an input mode, open the files
    in the shared upload directory and extract company names.
    """
    base_dir = settings.upload_dir
    companies: Set[str] = set()

    for fmeta in upload_context.files:
        file_path = os.path.join(base_dir, fmeta.filename)
        if not os.path.exists(file_path):
            continue

        lower_name = fmeta.originalName.lower()

        if input_mode == "excel":
            # Expecting only Excel files, but be defensive.
            if lower_name.endswith((".xlsx", ".xls")):
                companies |= extract_from_excel(file_path)
            else:
                # If some PDF got here accidentally, still handle it.
                if lower_name.endswith(".pdf"):
                    companies |= extract_from_pdf(file_path)
                elif lower_name.endswith(".zip"):
                    companies |= extract_from_zip(file_path)

        elif input_mode == "pdf_zip":
            if lower_name.endswith(".pdf"):
                companies |= extract_from_pdf(file_path)
            elif lower_name.endswith(".zip"):
                companies |= extract_from_zip(file_path)
            elif lower_name.endswith((".xlsx", ".xls")):
                # Some users may zip Excel + PDFs; handle anyway.
                companies |= extract_from_excel(file_path)

    # Normalize & sort
    normalized = sorted({c.strip() for c in companies if c.strip()})
    return normalized
