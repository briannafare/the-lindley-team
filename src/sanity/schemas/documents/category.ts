import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      description: 'Used on the category archive page and its meta description.',
    }),
    defineField({
      name: 'color',
      title: 'Pill color',
      type: 'string',
      initialValue: 'blue',
      options: {
        list: [
          { title: 'Blue', value: 'blue' },
          { title: 'Orange', value: 'orange' },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Ink', value: 'ink' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
})
