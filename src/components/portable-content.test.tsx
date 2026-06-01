import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import type {PortableTextBlock} from '@portabletext/types'
import {PortableContent} from './portable-content'

function blockWithLink(href: string): PortableTextBlock[] {
  return [
    {
      _type: 'block',
      _key: 'block-1',
      style: 'normal',
      markDefs: [{_type: 'link', _key: 'link-1', href}],
      children: [
        {
          _type: 'span',
          _key: 'span-1',
          text: 'dangerous link',
          marks: ['link-1'],
        },
      ],
    },
  ] as PortableTextBlock[]
}

describe('PortableContent', () => {
  it('does not render unsafe CMS links as anchors', () => {
    render(<PortableContent value={blockWithLink('javascript:alert(1)')} />)

    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText('dangerous link')).not.toBeNull()
  })

  it('renders https CMS links as anchors', () => {
    render(<PortableContent value={blockWithLink('https://example.com/post')} />)

    expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.com/post')
  })
})
