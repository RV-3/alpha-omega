import {defineField, defineType} from 'sanity'

export default defineType({
  name:  'wordStudyRaw',
  title: 'Word-Study JSON',
  type:  'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'File id (e.g. Matthew-3-14)',
      type: 'slug',
      validation: R => R.required(),
    }),
    defineField({
      name:  'title',
      title: 'Display title',
      type:  'string',
    }),
    defineField({
      name:  'data',
      title: 'Raw JSON',
      type:  'code',                 // ← built-in editor
      options: { language: 'json' }, // syntax highlight / brace match
      validation: R => R.required(),
    }),
  ],
})
