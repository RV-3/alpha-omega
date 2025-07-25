import os
import requests
import openai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, Frame

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

PROMPT_TEMPLATE = (
    "Crate this PDF \n"
    "✏️ {verse_ref} — Create ONE-PAGE Word-Study Sheet (8 × 10 in PDF)\n"
    "Ensure it fits elegantly on a single page, with no overflow or table overlap. "
    "Tables must be centered and gracefully styled. Use parchment-toned subtleties, fine serif typography, "
    "and classic layout symmetry. Apply light, antique grey table headers for clarity. "
    "Expand the word-study content fully to dignify the entire page with deep, flowing scholarship. "
    "(context blurb now hugs the top edge – see § 0) ..."
)


def fetch_verse_text(ref: str) -> str:
    """Retrieve verse text from bible-api.com."""
    url = f"https://bible-api.com/{ref.replace(' ', '%20')}"
    r = requests.get(url)
    r.raise_for_status()
    data = r.json()
    return data.get("text", "").strip()


def generate_analysis(verse_ref: str, verse_text: str) -> str:
    prompt = PROMPT_TEMPLATE.format(verse_ref=verse_ref)
    messages = [
        {"role": "system", "content": "You are a scholarly assistant that creates word study sheets."},
        {"role": "user", "content": prompt + "\nVerse: " + verse_text},
    ]
    response = openai.ChatCompletion.create(model=OPENAI_MODEL, messages=messages)
    return response.choices[0].message.content


def render_pdf(text: str, output_path: str):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    styles = getSampleStyleSheet()
    paragraphs = [Paragraph(p, styles["Normal"]) for p in text.split("\n")]
    frame = Frame(50, 50, width - 100, height - 100, showBoundary=0)
    for p in paragraphs:
        frame.addFromList([p], c)
    c.showPage()
    c.save()


def generate_book(book: str, chapters: int):
    for ch in range(1, chapters + 1):
        verse_num = 1
        while True:
            verse_ref = f"{book} {ch}:{verse_num}"
            try:
                verse_text = fetch_verse_text(verse_ref)
            except requests.HTTPError:
                break
            analysis = generate_analysis(verse_ref, verse_text)
            pdf_name = f"{verse_ref.replace(' ', '_').replace(':', '-')}.pdf"
            render_pdf(analysis, pdf_name)
            verse_num += 1


if __name__ == "__main__":
    generate_book("john", 21)
