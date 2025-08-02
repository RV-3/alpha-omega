import { fetchReferenceList, fetchReferenceData } from "./sanityClient.js";

let references = [];

/* ───────── helpers ───────── */
const $ = id => document.getElementById(id);
const showError  = msg => { const e=$('error-message'); e.textContent=msg; e.classList.remove('hidden'); };
const clearError = ()  => { const e=$('error-message'); e.textContent='';  e.classList.add   ('hidden'); };
function highlight(file){
  document.querySelectorAll('#ref-list li')
    .forEach(li => li.classList.toggle('selected', li.dataset.file===file));
  $('ref-select').value = file;
}

/* ───────── one‑time CSS for the modal ───────── */
function injectModalCSS(){
  if (document.getElementById('modal-css')) return;
  const css = `
    .hidden{display:none!important;}

    /* backdrop */
    #overlay{
      position:fixed;inset:0;background:rgba(0,0,0,.45);
      display:flex;align-items:flex-start;justify-content:center;
      padding:4rem 1rem;z-index:1000;overflow:auto;
    }

    /* card */
    .modal-card{
      position:relative;max-width:42rem;width:100%;
      background:#fff;color:#000;border-radius:.5rem;
      padding:2.5rem 2rem 2rem;box-shadow:0 4px 16px rgba(0,0,0,.25);
      line-height:1.45;font-family:Georgia,"Times New Roman",serif;
    }

    /* “×” button */
    .modal-close{
      position:absolute;top:.65rem;right:.65rem;
      font-size:1.35rem;font-weight:bold;
      border:none;background:transparent;cursor:pointer;color:#555;
    }
    .modal-close:hover{color:#000;}
  `;
  const style = document.createElement('style');
  style.id = 'modal-css';
  style.textContent = css;
  document.head.appendChild(style);
}

/* ───────── open & close modal ───────── */
function openPopup(html){
  injectModalCSS();

  // build inner card (button + content)
  const card = document.createElement('div');
  card.className = 'modal-card';
  card.innerHTML = `<button class="modal-close" aria-label="Close">×</button>${html}`;

  // clear previous content & mount new card
  const overlay = $('overlay');
  overlay.innerHTML = '';               // remove old card
  overlay.appendChild(card);
  overlay.classList.remove('hidden');

  // close handlers
  card.querySelector('.modal-close').onclick =
    () => overlay.classList.add('hidden');

  document.onkeydown = e=>{
    if(e.key==='Escape') overlay.classList.add('hidden');
  };
}

/* ───────── sort helper ───────── */
function sortRefs(refs){
  const parse = f => { const m=f.match(/^(.*?)-(\d+)-(\d+)/); return m?[m[1],+m[2],+m[3]]:[f,0,0]; };
  return refs.slice().sort((a,b)=>{
    const [ba,ca,va]=parse(a.file), [bb,cb,vb]=parse(b.file);
    return ba!==bb?ba.localeCompare(bb):ca!==cb?ca-cb:va-vb;
  });
}

/* ───────── load a sheet ───────── */
async function loadData(file){
  try{
    const data = await fetchReferenceData(file);
    clearError();

    $('title').textContent    = data.title    || '';
    $('context').textContent  = data.context  || '';
    $('subtitle').textContent = data.subtitle || '';
    $('source').textContent   = data.source   ? `Source: ${data.source}` : '';

    /* map <b>Greek</b> → snippet */
    const entryMap = {};
    (data.entries||[]).forEach(raw=>{
      const safe = DOMPurify.sanitize(raw.replace(/\n/g,'<br>'),
                   {ALLOWED_TAGS:['b','i','em','strong','u','br']});
      const div  = document.createElement('div'); div.innerHTML = safe;
      const key  = div.querySelector('b')?.textContent.trim();
      if(key) entryMap[key] = div.innerHTML;
    });

    /* build table */
    const table = $('word-table'); table.innerHTML='';
    (data.table||[]).forEach((row,idx)=>{
      const tr = document.createElement('tr');
      row.forEach(cell=>{
        const el=document.createElement(idx?'td':'th');
        el.textContent=cell; tr.appendChild(el);
      });
      if(idx && entryMap[row[0]]){
        tr.classList.add('keyword'); tr.dataset.word=row[0];
      }
      table.appendChild(tr);
    });

    /* click → pop-up */
    document.querySelectorAll('tr.keyword').forEach(tr=>{
      tr.onclick = () => openPopup(entryMap[tr.dataset.word]);
    });

  }catch(err){
    console.error(err);
    showError('Unable to contact content service.');
    ['word-table','title','context','subtitle','source']
      .forEach(id=>$(id).innerHTML='');
    highlight('');
  }
}

/* ───────── init list ───────── */
async function init(){
  const list=$('ref-list'), select=$('ref-select');

  try{
    const manifest = await fetchReferenceList(); clearError();
    references = sortRefs(manifest.references);
  }catch{
    showError('Unable to contact content service.');
    list.innerHTML='<li class="placeholder">No references available</li>';
    return;
  }

  references.forEach(ref=>{
    const li=document.createElement('li');
    li.textContent=ref.title; li.dataset.file=ref.file;
    li.onclick = ()=>{ highlight(ref.file); loadData(ref.file); };
    list.appendChild(li);

    const opt=document.createElement('option');
    opt.value=ref.file; opt.textContent=ref.title; select.appendChild(opt);
  });

  $('search').oninput = e=>{
    const q=e.target.value.toLowerCase();
    list.querySelectorAll('li')
      .forEach(li=>li.style.display=li.textContent.toLowerCase().includes(q)?'':'none');
  };
  select.onchange = ()=>{ highlight(select.value); loadData(select.value); };

  if(references.length){ highlight(references[0].file); loadData(references[0].file); }
}

/* nav buttons */
$('prev-btn').onclick = ()=>nav(-1);
$('next-btn').onclick = ()=>nav(1);
function nav(step){
  const idx=references.findIndex(r=>r.file===$('ref-select').value);
  const nxt=idx+step;
  if(nxt>=0 && nxt<references.length){
    highlight(references[nxt].file); loadData(references[nxt].file);
  }
}

/* start */
document.addEventListener('DOMContentLoaded', init);
