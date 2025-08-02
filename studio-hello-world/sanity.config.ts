// sanity.config.ts  ── Sanity v3
import { defineConfig } from 'sanity'
import { deskTool }     from 'sanity/desk'
import { visionTool }   from '@sanity/vision'
import { codeInput }   from '@sanity/code-input'   // ← add

/* ------------ import your schema types ------------ */
import bibleVerse   from './schemaTypes/bibleVerse'
import wordStudyRaw from './schemaTypes/wordStudyRaw'

/* collect them in one array the Studio can see */
const schemaTypes = [bibleVerse, wordStudyRaw]

export default defineConfig({
  /* ---- project basics ---- */
  projectId: 'yxwgk345',   // ← put your real project ID
  dataset:   'production',      // ← or dev / staging
  title:     'alpha-omega',


  /* ---- plugins ---- */
  plugins: [
    deskTool(),
    visionTool(),
    codeInput(),
    // inputJson(),   // ← only if you installed the JSON plug-in
  ],

  /* ---- schema ---- */
  schema: {
    types: schemaTypes,         // now defined ✅
  },
})
