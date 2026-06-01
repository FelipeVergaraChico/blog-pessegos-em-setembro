import {describe, expect, it} from 'vitest'
import {readingTime} from './read-time'

describe('readingTime', () => {
  it('returns at least one minute for short text', () => {
    expect(readingTime('texto curto')).toBe('1 min de leitura')
  })

  it('rounds longer text by 220 words per minute', () => {
    const text = Array.from({length: 440}, () => 'palavra').join(' ')

    expect(readingTime(text)).toBe('2 min de leitura')
  })
})
