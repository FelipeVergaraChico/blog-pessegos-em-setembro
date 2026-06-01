export type SanityWebhookPayload = {
  _type?: string
  _id?: string
  operation?: 'create' | 'update' | 'delete'
}

export function tagsForWebhookPayload(payload: SanityWebhookPayload) {
  switch (payload._type) {
    case 'post':
      return ['post', 'category', 'settings']
    case 'category':
      return ['category', 'post']
    case 'settings':
      return ['settings']
    case 'about':
      return ['about']
    default:
      return []
  }
}
