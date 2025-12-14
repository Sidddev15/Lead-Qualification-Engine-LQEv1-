import os
import sys

# Ensure `app` package (in project root) is importable when running pytest from repo root.
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
