export default {
  name: 'verse',
  title: 'Verse',
  type: 'document',
  fields: [
    {
      name: 'reference',
      title: 'Reference',
      type: 'reference',
      to: [{ type: 'reference' }]
    },
    {
      name: 'context',
      type: 'string',
      title: 'Context'
    },
    {
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle'
    },
    {
      name: 'source',
      type: 'string',
      title: 'Source'
    },
    {
      name: 'table',
      title: 'Table',
      type: 'array',
      of: [
        {
          type: 'array',
          of: [{ type: 'string' }]
        }
      ]
    },
    {
      name: 'entries',
      title: 'Entries',
      type: 'array',
      of: [{ type: 'text' }]
    }
  ]
};
