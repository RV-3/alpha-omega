export default {
  name: 'reference',
  title: 'Reference',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        slugify: input =>
          input
            .replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
            .toLowerCase()
      }
    }
  ]
};
