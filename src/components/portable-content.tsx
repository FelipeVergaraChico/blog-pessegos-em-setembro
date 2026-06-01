import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import {safeHref} from '@/src/lib/safe-url'
import type {SanityImage} from '@/src/sanity/types'
import {ImageFrame} from './image-frame'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="mb-6 text-lg leading-8 text-coffee/80 dark:text-paper/80">{children}</p>,
    h2: ({children}) => (
      <h2 className="mb-4 mt-10 font-serif text-4xl leading-none text-coffee dark:text-paper">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mb-3 mt-8 font-serif text-3xl leading-none text-coffee dark:text-paper">{children}</h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-4 border-peach pl-5 font-serif text-3xl leading-tight text-wine dark:text-peach">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({children, value}) => {
      const href = safeHref(value?.href)

      if (!href) {
        return <span>{children}</span>
      }

      return (
        <a href={href} className="text-wine underline decoration-peach underline-offset-4 dark:text-peach">
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({value}) => <ImageFrame image={value as SanityImage} className="my-8 aspect-[16/10] w-full" />,
  },
}

export function PortableContent({value}: {value?: PortableTextBlock[]}) {
  if (!value?.length) {
    return null
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PortableText value={value} components={components} />
    </div>
  )
}
