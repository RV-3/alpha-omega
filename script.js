async function loadData(file) {
  const response = await fetch(`data/${file}`);
  const data = await response.json();

  document.getElementById('title').textContent = data.title;
  document.getElementById('context').textContent = data.context;
  document.getElementById('subtitle').textContent = data.subtitle;
  document.getElementById('source').textContent = `Source: ${data.source}`;

  // Map of Greek word -> entry HTML
  const entryMap = {};
  data.entries.forEach(raw => {
    // Sanitize the HTML snippet to remove potentially dangerous tags
    const safe = DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br']
    });

    const div = document.createElement('div');
    div.innerHTML = safe;
    const bold = div.querySelector('b');
    if (bold) {
      const key = bold.textContent.trim();
      entryMap[key] = div.innerHTML; // store the sanitized snippet
    }
  });

  // Build table
  const table = document.getElementById('word-table');
  table.innerHTML = '';
  data.table.forEach((row, index) => {
    const tr = document.createElement('tr');
    row.forEach((cell, ci) => {
      const el = index === 0 ? document.createElement('th') : document.createElement('td');
      el.textContent = cell;
      tr.appendChild(el);
    });
    if (index > 0 && entryMap[row[0]]) {
      tr.classList.add('keyword');
      tr.dataset.word = row[0];
    }
    table.appendChild(tr);
  });

  document.querySelectorAll('tr.keyword').forEach(tr => {
    tr.addEventListener('click', () => {
      const word = tr.dataset.word;
      const html = entryMap[word];
      if (html) showEntry(html);
    });
  });
}

function showEntry(html) {
  const overlay = document.getElementById('overlay');
  const content = document.getElementById('entry-content');
  content.innerHTML = html;
  overlay.classList.remove('hidden');
}

document.getElementById('close-btn').addEventListener('click', () => {
  document.getElementById('overlay').classList.add('hidden');
});

async function init() {
  const indexRes = await fetch('data/index.json');
  const manifest = await indexRes.json();

  const select = document.getElementById('ref-select');
  manifest.references.forEach(ref => {
    const option = document.createElement('option');
    option.value = ref.file;
    option.textContent = ref.title;
    select.appendChild(option);
  });

  select.addEventListener('change', () => loadData(select.value));

  if (manifest.references.length > 0) {
    select.value = manifest.references[0].file;
    loadData(select.value);
  }
}

document.addEventListener('DOMContentLoaded', init);
