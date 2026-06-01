export const cacheTags = {
  post: 'post',
  category: 'category',
  settings: 'settings',
  about: 'about',
} as const

const postFields = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  featured,
  "coverImage": mainImage{
    asset,
    alt,
    hotspot,
    crop
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current,
    description,
    color
  },
  seo
`

export const featuredPostQuery = `*[_type == "post" && defined(slug.current) && featured == true] | order(publishedAt desc)[0] {${postFields}, body}`

export const recentPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...9] {${postFields}}`

export const allPostsQuery = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {${postFields}}`

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {${postFields}, body}`

export const postsByCategoryQuery = `*[_type == "post" && category->slug.current == $slug] | order(publishedAt desc) {${postFields}}`

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {_id, title, "slug": slug.current, description, color}`

export const categoriesQuery = `*[_type == "category"] | order(title asc) {_id, title, "slug": slug.current, description, color}`

export const settingsQuery = `*[_type == "settings"][0] {title, description, socialLinks, newsletterText, quote, seo}`

export const aboutQuery = `*[_type == "about"][0] {title, body, seo}`

export const searchPostsQuery = `*[
  _type == "post" &&
  defined(slug.current) &&
  (
    title match $term ||
    excerpt match $term ||
    category->title match $term
  )
] | order(publishedAt desc) {${postFields}}`
