import {NextRequest} from 'next/server'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {POST} from './route'

const revalidateTag = vi.fn()

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}))

function request(url: string, headers: HeadersInit = {}) {
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({_type: 'post'}),
  })
}

describe('POST /api/revalidate', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    revalidateTag.mockClear()
  })

  it('rejects secrets sent in the query string', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret')

    const response = await POST(request('http://localhost/api/revalidate?secret=test-secret'))

    expect(response.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('accepts the revalidation secret from the Sanity header', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret')

    const response = await POST(
      request('http://localhost/api/revalidate', {'x-sanity-revalidate-secret': 'test-secret'}),
    )

    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('post', 'max')
  })
})
