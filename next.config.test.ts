import {describe, expect, it} from 'vitest'
import {contentSecurityPolicy} from './next.config'

describe('contentSecurityPolicy', () => {
  it('allows eval only outside production for React development tooling', () => {
    expect(contentSecurityPolicy('development')).toContain("'unsafe-eval'")
    expect(contentSecurityPolicy('production')).not.toContain("'unsafe-eval'")
  })
})
