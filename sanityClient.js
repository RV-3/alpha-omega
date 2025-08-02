/* ---------------------------------------------------------------
   sanityClient.js   —  for Code-input (“data.code”) storage mode
   --------------------------------------------------------------- */

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } = window;

const BASE_URL =
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}` +
  `/data/query/${SANITY_DATASET}`;

/* ───────── sidebar list ───────── */
export async function fetchReferenceList() {
  const query = `*[_type=="wordStudyRaw"]|order(slug.current asc){
      "file": slug.current,
      "code": data.code         // raw JSON string
  }`.trim();

  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`;
  const { result } = await (await fetch(url)).json();

  const references = (result || []).map(r => {
    let title;
    try {
      title = JSON.parse(r.code || '{}').title;
    } catch (_) {
      /* bad JSON in Code field – ignore */
    }
    /* fall back to a human-friendly slug */
    if (!title) title = r.file.replace(/-/g, ' ').replace(/(\d+)-(\d+)$/, '$1:$2');
    return { file: r.file, title };
  });

  return { references };
}

/* ───────── single sheet ───────── */
export async function fetchReferenceData(slug) {
  const query = `*[_type=="wordStudyRaw" && slug.current==$slug][0]{
      "code": data.code
  }`.trim();

  const slugParam = encodeURIComponent(JSON.stringify(slug)); // "%22Matthew-3-14%22"
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}&$slug=${slugParam}`;

  const { result } = await (await fetch(url)).json();
  if (!result?.code) throw new Error('document not found');

  return JSON.parse(result.code);          // {title, context, table, …}
}

export { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION };
