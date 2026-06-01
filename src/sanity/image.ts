import {createImageUrlBuilder} from '@sanity/image-url'
import {client} from '@/src/sanity/client'
import type {SanityImage} from '@/src/sanity/types'

export function urlForImage(source?: SanityImage) {
  if (!client || !source?.asset) {
    return null
  }

  return createImageUrlBuilder(client).image(source).auto('format').fit('max')
}
