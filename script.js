import { fetchReferenceList, fetchReferenceData } from "./sanityClient.js";

let references = [];

function showError(msg) {
  const el = document.getElementById('error-message');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearError() {
  const el = document.getElementById('error-message');
  el.textContent = '';
  el.classList.add('hidden');
}

function sortRefs(refs) {
  const parse = file => {
    const m = file.match(/^(.*?)-(\d+)-(\d+)(?:\.json)?$/);
    if (!m) return [file, 0, 0];
    return [m[1], parseInt(m[2], 10), parseInt(m[3], 10)];
  };
  return refs.slice().sort((a, b) => {
    const [bookA, chA, vA] = parse(a.file);
    const [bookB, chB, vB] = parse(b.file);
    if (bookA < bookB) return -1;
    if (bookA > bookB) return 1;
    if (chA !== chB) return chA - chB;
    return vA - vB;
  });
}

async function loadData(file) {
  try {
    const data = await fetchReferenceData(file);
    clearError();

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
  } catch (err) {
    showError('Failed to load the selected reference.');
    document.getElementById('word-table').innerHTML = '';
    document.getElementById('title').textContent = '';
    document.getElementById('context').textContent = '';
    document.getElementById('subtitle').textContent = '';
    document.getElementById('source').textContent = '';
    highlightSelected('');
  }
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

function highlightSelected(file) {
  document.querySelectorAll('#ref-list li').forEach(li => {
    li.classList.toggle('selected', li.dataset.file === file);
  });
  const select = document.getElementById('ref-select');
  select.value = file;
}

function changeReference(offset) {
  const select = document.getElementById('ref-select');
  const idx = references.findIndex(r => r.file === select.value);
  const nextIndex = idx + offset;
  if (nextIndex >= 0 && nextIndex < references.length) {
    select.value = references[nextIndex].file;
    highlightSelected(select.value);
    loadData(select.value);
  }
}

document.getElementById('prev-btn').addEventListener('click', () => changeReference(-1));
document.getElementById('next-btn').addEventListener('click', () => changeReference(1));

async function init() {
  let manifest;
  try {
    manifest = await fetchReferenceList();
    clearError();
  } catch (err) {
    showError('Failed to load reference list.');
    return;
  }

  references = sortRefs(manifest.references);

  const list = document.getElementById('ref-list');
  const select = document.getElementById('ref-select');

  references.forEach(ref => {
    const li = document.createElement('li');
    li.textContent = ref.title;
    li.dataset.file = ref.file;
    li.addEventListener('click', () => {
      highlightSelected(ref.file);
      loadData(ref.file);
    });
    list.appendChild(li);

    const option = document.createElement('option');
    option.value = ref.file;
    option.textContent = ref.title;
    select.appendChild(option);
  });

  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    list.querySelectorAll('li').forEach(li => {
      li.style.display = li.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  select.addEventListener('change', () => {
    highlightSelected(select.value);
    loadData(select.value);
  });
}

document.addEventListener('DOMContentLoaded', init);
