import {describe, expect, it} from 'vitest'
import {formatDate} from './format-date'

describe('formatDate', () => {
  it('formats dates in Brazilian Portuguese', () => {
    expect(formatDate('2026-05-31T12:00:00.000Z')).toContain('2026')
  })

  it('returns an empty string when date is missing', () => {
    expect(formatDate()).toBe('')
  })
})
