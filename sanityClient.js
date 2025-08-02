const { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } = window;

const BASE_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

export async function fetchReferenceList() {
  const query = '*[_type=="reference"]{ "file": slug.current, title }';
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`request failed with status ${res.status}`);
    }
    const { result } = await res.json();
    return { references: result || [] };
  } catch (err) {
    throw new Error(`fetchReferenceList: ${err.message}`);
  }
}

export async function fetchReferenceData(slug) {
  const query = '*[_type=="verse" && reference->slug.current == $slug][0]{"title": reference->title, context, subtitle, source, table, entries }';
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`request failed with status ${res.status}`);
    }
    const { result } = await res.json();
    return result;
  } catch (err) {
    throw new Error(`fetchReferenceData: ${err.message}`);
  }
}

export { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION };
