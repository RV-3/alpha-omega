# alpha-omega

This repository contains a simple Python script, `generate_john.py`, that creates
one-page PDF word-study sheets for every verse in the Gospel of John. It fetches
the verse text from [bible-api.com](https://bible-api.com), generates an
analysis with the OpenAI API, and renders the result as a PDF using ReportLab.

## Prerequisites

- Python 3.8 or higher
- An OpenAI API key

## Setup

Clone the repository and install the dependencies:

```bash
git clone <repo-url>
cd alpha-omega
pip install -r requirements.txt
```

## Required Environment Variables

- `OPENAI_API_KEY` – your OpenAI API key used to access the API
- `OPENAI_MODEL` – *(optional)* the model name to use (defaults to
  `gpt-3.5-turbo`)

Set these variables in your shell before running the script:

```bash
export OPENAI_API_KEY=your-api-key
# Optional: choose a specific model
export OPENAI_MODEL=gpt-4
```

## Installation

1. Install Python 3.8+ and `pip` if they are not already available.
2. Install the project dependencies. The `requirements.txt` file pins the exact
   versions of OpenAI and ReportLab used by this project:

   ```bash
   pip install -r requirements.txt
   ```

## Usage

Before running the script, make sure the `OPENAI_API_KEY` environment variable is
set. Optionally define `OPENAI_MODEL` if you want to use a different model.

Run the script with Python:

```bash
python3 generate_john.py --book john --chapters 21
```

The `--book` and `--chapters` options are optional; they default to `john` and
`21` respectively. The script will create one PDF per verse in the specified
book and chapter range.

Generated PDFs are saved in the directory where you run the command. Open them
with Finder or from the terminal:

```bash
open john_1-1.pdf
```
