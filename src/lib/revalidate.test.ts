import {describe, expect, it} from 'vitest'
import {tagsForWebhookPayload} from './revalidate'

describe('tagsForWebhookPayload', () => {
  it('maps post events to post, category and settings-sensitive pages', () => {
    expect(tagsForWebhookPayload({_type: 'post'})).toEqual(['post', 'category', 'settings'])
  })

  it('maps category events to category and post listings', () => {
    expect(tagsForWebhookPayload({_type: 'category'})).toEqual(['category', 'post'])
  })

  it('maps settings events to settings', () => {
    expect(tagsForWebhookPayload({_type: 'settings'})).toEqual(['settings'])
  })

  it('maps about events to about', () => {
    expect(tagsForWebhookPayload({_type: 'about'})).toEqual(['about'])
  })

  it('returns an empty list for unknown document types', () => {
    expect(tagsForWebhookPayload({_type: 'author'})).toEqual([])
  })
})
