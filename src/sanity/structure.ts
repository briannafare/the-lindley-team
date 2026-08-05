import type { StructureResolver } from 'sanity/structure'
import { DocumentTextIcon, EditIcon, StarIcon, TagIcon, UserIcon } from '@sanity/icons'

/**
 * Sidebar layout. Ordered so the two things the editor actually does every
 * week - "write the next one" and "publish it" - are the top two items.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('The Lindley Journal')
    .items([
      S.listItem()
        .title('Needs writing')
        .icon(EditIcon)
        .child(
          S.documentTypeList('post')
            .title('Needs writing')
            .filter('_type == "post" && needsFullDraft == true')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      S.listItem()
        .title('All articles')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('All articles')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      S.listItem()
        .title('Featured')
        .icon(StarIcon)
        .child(
          S.documentTypeList('post')
            .title('Featured')
            .filter('_type == "post" && featured == true')
        ),

      S.divider(),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),

      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),
    ])
