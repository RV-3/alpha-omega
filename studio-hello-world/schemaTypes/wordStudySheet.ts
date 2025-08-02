import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'wordStudySheet',
  title: 'Word‑Study Sheet',
  type: 'document',
  fields: [
    /* ─────────── metadata ─────────── */
    defineField({ name: 'title',     title: 'Title',          type: 'string', validation: R => R.required() }),
    defineField({ name: 'reference', title: 'Reference',      type: 'string' }),              // e.g. “Matthew 3 : 14”
    defineField({ name: 'slug',      title: 'Slug / File id', type: 'slug',
      options: { source: 'reference', maxLength: 96 } }),     // “Matthew-3-14”

    /* ─────────── header blurb ─────── */
    defineField({ name: 'context',   title: 'Context blurb',  type: 'text' }),
    defineField({ name: 'subtitle',  title: 'Subtitle',       type: 'string' }),
    defineField({ name: 'source',    title: 'Source edition', type: 'string' }),

    /* ─────────── main content ─────── */
    defineField({
      name:  'table',
      title: 'Word‑by‑word table',
      type:  'array',
      of:    [ { type: 'tableRow' } ],         // uses the object type above
    }),
    defineField({
      name:  'entries',
      title: 'Lexical / exegetical entries',
      type:  'array',
      of:    [ { type: 'text' } ],             // keeps the existing inline‑HTML bullets you’ve authored
    }),
  ],
})
