import {describe, expect, it} from 'vitest'
import {safeHref} from './safe-url'

describe('safeHref', () => {
  it.each(['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:alert(1)', '//evil.test'])(
    'rejects unsafe href %s',
    (href) => {
      expect(safeHref(href)).toBeUndefined()
    },
  )

  it.each(['https://example.com/post', 'http://example.com/post', 'mailto:test@example.com', '/posts/example', '#content'])(
    'allows safe href %s',
    (href) => {
      expect(safeHref(href)).toBe(href)
    },
  )
})
