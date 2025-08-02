export const SANITY_PROJECT_ID = 'your_project_id';
export const SANITY_DATASET = 'production';
export const SANITY_API_VERSION = '2023-10-01';

const BASE_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

export async function fetchReferenceList() {
  const query = '*[_type=="reference"]{ "file": slug.current, title }';
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('request failed');
  const { result } = await res.json();
  return { references: result || [] };
}

export async function fetchReferenceData(slug) {
  const query = '*[_type=="verse" && reference->slug.current == $slug][0]{"title": reference->title, context, subtitle, source, table, entries }';
  const url = `${BASE_URL}?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('request failed');
  const { result } = await res.json();
  return result;
}
