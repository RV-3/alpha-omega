/* ---------------------------------------------------------------
   sanityClient.js   —  for Code-input (“data.code”) storage mode
   --------------------------------------------------------------- */

const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } = window;

const BASE_URL =
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}` +
  `/data/query/${SANITY_DATASET}`;

/* ───────── sidebar list ───────── */
export async function fetchReferenceList() {
  const query = `
    *[_type=="wordStudyRaw"] | order(slug.current asc){
      "file": slug.current,
      "code": data.code
    }
  `;
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`request failed with status ${res.status}`);

  const { result } = await res.json();
  const references = (result || []).map(r => {
    const blob = JSON.parse(r.code || '{}');
    return { file: r.file, title: blob.title || r.file };
  });
  return { references };
}

/* ───────── single sheet ───────── */
export async function fetchReferenceData(slug) {
  const query = `
    *[_type=="wordStudyRaw" && slug.current == $slug][0]{
      "code": data.code
    }
  `;

  /* JSON-encode the slug so it becomes "$slug=%22Matthew-3-14%22" */
  const slugParam = encodeURIComponent(JSON.stringify(slug));
  const url =
    `${BASE_URL}?query=${encodeURIComponent(query)}&$slug=${slugParam}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`request failed with status ${res.status}`);

  const { result } = await res.json();
  if (!result || !result.code) return null;

  return JSON.parse(result.code);
}

export { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION };
