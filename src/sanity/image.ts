import imageUrlBuilder from '@sanity/image-url'
import {client} from '@/src/sanity/client'
import type {SanityImage} from '@/src/sanity/types'

const builder = imageUrlBuilder(client)

export function urlForImage(source?: SanityImage) {
  if (!source?.asset) {
    return null
  }

  return builder.image(source).auto('format').fit('max')
}
