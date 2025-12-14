import re
import requests
import tldextract
from urllib.parse import urlparse

TIMEOUT = 4

DOMAIN_REGEX = re.compile(r"\b((?:https?://)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,})\b")

URL_PATTERN = re.compile(
    r"(https?://[A-Za-z0-9.\-]+\.[A-Za-z]{2,})(?:/[\w\-./?%&=]*)?", flags=re.IGNORECASE
)


def normalize_url(raw: str) -> str:
    if not raw.startswith("http"):
        return f"https://{raw}"
    return raw


def is_valid_website(url: str) -> bool:
    try:
        res = requests.head(
            url,
            timeout=TIMEOUT,
            allow_redirects=True,
            headers={"User-Agent": "LQE-Bot/1.0"},
        )
        return 200 <= res.status_code < 400
    except Exception:
        return False


def extract_and_validate_website(text: str) -> str | None:
    matches = DOMAIN_REGEX.findall(text)

    for match in matches:
        url = normalize_url(match)
        if is_valid_website(url):
            return url

    return None


def detect_website(text: str) -> str | None:
    matches = URL_PATTERN.findall(text)
    if matches:
        return matches[0]

    domain_pattern = re.compile(r"\b([A-Za-z0-9\-]+\.[A-Za-z]{2,})\b")
    m = domain_pattern.search(text)
    if m:
        return f"http://{m.group(1)}"

    return None


def probe_website(url: str) -> bool:
    try:
        r = requests.head(url, timeout=3)
        return r.status_code < 400
    except:
        return False


def normalize_website(url: str) -> str:
    if not url:
        return None

    if not url.startswith("http"):
        url = "http://" + url

        # standardize
        extracted = tldextract.extract(url)
        domain = f"{extracted.domain}.{extracted.suffix}"
        return f"http://{domain}"
