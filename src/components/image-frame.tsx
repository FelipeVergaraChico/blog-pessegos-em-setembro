import Image from 'next/image'
import {urlForImage} from '@/src/sanity/image'
import type {SanityImage} from '@/src/sanity/types'

type ImageFrameProps = {
  image?: SanityImage
  alt?: string
  priority?: boolean
  className?: string
}

export function ImageFrame({image, alt = '', priority = false, className = ''}: ImageFrameProps) {
  const url = urlForImage(image)

  if (!url) {
    return <div className={`rounded-card bg-peach/30 ${className}`} aria-hidden />
  }

  return (
    <Image
      src={url.width(1400).height(900).url()}
      alt={image?.alt || alt}
      width={1400}
      height={900}
      priority={priority}
      className={`rounded-card object-cover ${className}`}
    />
  )
}
