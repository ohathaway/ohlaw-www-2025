/**
 * Type definitions for Strapi blog content
 *
 * Models the rich text JSON format and content types
 * returned by the Strapi 5 REST API.
 */

// -- Rich Text (Strapi JSON) --

export interface RichTextChild {
  type: 'text' | 'link'
  text?: string
  url?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  children?: RichTextChild[]
}

export interface RichTextBlock {
  type: 'paragraph' | 'heading' | 'list' | 'image' | 'quote'
  level?: number
  format?: 'ordered' | 'unordered'
  children: RichTextChild[]
}

// -- Strapi Media --

export interface StrapiImage {
  id?: number
  documentId?: string
  name?: string
  caption?: string | null
  alternativeText?: string | null
  url: string
  previewUrl?: string | null
  provider?: string
}

// -- Blog Content Types --

export interface BlogTag {
  id: number
  documentId: string
  Name: string
  slug: string
  posts?: BlogPost[]
  terms?: GlossaryTerm[]
}

export interface BlogCategory {
  id: number
  documentId: string
  Name: string
  slug: string
  hero?: RichTextBlock[]
  Image?: StrapiImage
  posts?: BlogPost[]
  faq?: FaqItem[]
}

export interface BlogPost {
  id: number
  documentId: string
  Title: string
  slug: string
  Snippet?: RichTextBlock[]
  Content?: RichTextBlock[]
  CTA?: RichTextBlock[]
  publishDate: string
  updatedAt?: string
  Image?: StrapiImage
  category?: BlogCategory
  tags?: BlogTag[]
}

// -- Supporting Types --

export interface GlossaryTerm {
  term: string
  definition: string
  sources?: string
  slug: string
}

export interface FaqItem {
  question: string
  answer: string
}
