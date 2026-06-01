import {describe, expect, it} from 'vitest'
import {portableTextToPlainText} from './page'

describe('portableTextToPlainText', () => {
  it('returns an empty string for null Sanity bodies', () => {
    expect(portableTextToPlainText(null)).toBe('')
  })

  it('extracts text from portable text blocks', () => {
    expect(
      portableTextToPlainText([
        {
          children: [{text: 'Primeiro'}, {text: 'texto'}],
        },
      ]),
    ).toBe('Primeiro texto')
  })
})
