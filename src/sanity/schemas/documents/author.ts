import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      description: 'e.g. Senior Loan Officer, CDLP',
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials line',
      type: 'string',
      description:
        'Shown under the headline and used in Article schema. e.g. NMLS #1367416',
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
      description:
        'Two or three sentences. Feeds the author box, which is a real E-E-A-T signal for mortgage content.',
    }),
    defineField({
      name: 'headshot',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'links',
      title: 'Profile links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'LinkedIn, NMLS Consumer Access, etc. Emitted as sameAs.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'title', media: 'headshot' } },
})
