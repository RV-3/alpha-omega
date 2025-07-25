import os
import logging
import time
import argparse
import requests
import openai
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, Frame

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

PROMPT_TEMPLATE = (
    "Create this PDF \n"
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
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
    except requests.RequestException as e:
        logging.error("Failed to fetch verse %s: %s", ref, e)
        raise
    data = r.json()
    return data.get("text", "").strip()


def generate_analysis(verse_ref: str, verse_text: str) -> str:
    prompt = PROMPT_TEMPLATE.format(verse_ref=verse_ref)
    messages = [
        {"role": "system", "content": "You are a scholarly assistant that creates word study sheets."},
        {"role": "user", "content": prompt + "\nVerse: " + verse_text},
    ]
    error = None
    for attempt in range(2):
        try:
            response = openai.ChatCompletion.create(model=OPENAI_MODEL, messages=messages)
            return response.choices[0].message.content
        except openai.error.OpenAIError as e:
            error = e
            logging.error("OpenAI API error on attempt %d for %s: %s", attempt + 1, verse_ref, e)
            if attempt == 0:
                time.sleep(1)
            else:
                raise
    raise error


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
    parser = argparse.ArgumentParser(
        description="Generate word-study PDFs for a book of the Bible"
    )
    parser.add_argument(
        "--book",
        default="john",
        help="Name of the book to process (default: john)",
    )
    parser.add_argument(
        "--chapters",
        type=int,
        default=21,
        help="Number of chapters in the book",
    )
    args = parser.parse_args()

    generate_book(args.book, args.chapters)
