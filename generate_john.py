import os
import logging
import time
import argparse
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


def generate_analysis(verse_ref: str) -> str:
    prompt = PROMPT_TEMPLATE.format(verse_ref=verse_ref)
    messages = [
        {"role": "system", "content": "You are a scholarly assistant that creates word study sheets."},
        {"role": "user", "content": prompt},
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


def generate_range(book: str, chapter: int, start: int, end: int):
    for verse_num in range(start, end + 1):
        verse_ref = f"{book} {chapter}:{verse_num}"
        analysis = generate_analysis(verse_ref)
        pdf_name = f"{verse_ref.replace(' ', '_').replace(':', '-')}.pdf"
        render_pdf(analysis, pdf_name)


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
        "--chapter",
        type=int,
        default=1,
        help="Chapter number to process",
    )
    parser.add_argument(
        "--start",
        type=int,
        default=1,
        help="Starting verse number",
    )
    parser.add_argument(
        "--end",
        type=int,
        default=1,
        help="Ending verse number",
    )
    args = parser.parse_args()

    generate_range(args.book, args.chapter, args.start, args.end)
