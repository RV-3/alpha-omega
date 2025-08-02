import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bibleVerse',
  title: 'Bible Verse',
  type: 'document',
  fields: [
    defineField({
      name: 'book',
      title: 'Book',
      type: 'string',
    }),
    defineField({
      name: 'chapter',
      title: 'Chapter',
      type: 'number',
    }),
    defineField({
      name: 'verse',
      title: 'Verse',
      type: 'number',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
    }),
  ],
})
