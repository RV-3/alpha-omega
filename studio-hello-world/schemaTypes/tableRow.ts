import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'tableRow',
  title: 'Word‑table row',
  type: 'object',
  fields: [
    defineField({ name: 'greek',     title: 'Greek',     type: 'string' }),
    defineField({ name: 'translit',  title: 'Translit.', type: 'string' }),
    defineField({ name: 'gloss',     title: 'Gloss',     type: 'string' }),
  ],
})
