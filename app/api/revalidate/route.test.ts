import {NextRequest} from 'next/server'
import {afterEach, describe, expect, it, vi} from 'vitest'

const {revalidateTag, isValidSignature} = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
  isValidSignature: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => revalidateTag(...args),
}))

vi.mock('@sanity/webhook', () => ({
  SIGNATURE_HEADER_NAME: 'sanity-webhook-signature',
  isValidSignature: (...args: unknown[]) => isValidSignature(...args),
}))

function request(url: string, headers: HeadersInit = {}, body = JSON.stringify({_type: 'post'})) {
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body,
  })
}

async function post(request: NextRequest) {
  const {POST} = await import('./route')
  return POST(request)
}

describe('POST /api/revalidate', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    revalidateTag.mockClear()
    isValidSignature.mockReset()
  })

  it('rejects requests when the Sanity signature header is missing', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret')

    const response = await post(request('http://localhost/api/revalidate?secret=test-secret'))

    expect(response.status).toBe(401)
    expect(isValidSignature).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects invalid Sanity signatures', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret')
    isValidSignature.mockResolvedValue(false)

    const response = await post(
      request('http://localhost/api/revalidate', {'sanity-webhook-signature': 'invalid-signature'}),
    )

    expect(response.status).toBe(401)
    expect(isValidSignature).toHaveBeenCalledWith(JSON.stringify({_type: 'post'}), 'invalid-signature', 'test-secret')
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects invalid JSON after validating the signature', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret')
    isValidSignature.mockResolvedValue(true)

    const response = await post(
      request('http://localhost/api/revalidate', {'sanity-webhook-signature': 'valid-signature'}, '{'),
    )

    expect(response.status).toBe(400)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('accepts valid Sanity webhook signatures', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', 'test-secret')
    isValidSignature.mockResolvedValue(true)

    const response = await post(
      request('http://localhost/api/revalidate', {'sanity-webhook-signature': 'valid-signature'}),
    )

    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('post', 'max')
  })
})
