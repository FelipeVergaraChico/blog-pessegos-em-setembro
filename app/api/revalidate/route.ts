import {revalidateTag} from 'next/cache'
import type {NextRequest} from 'next/server'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {tagsForWebhookPayload, type SanityWebhookPayload} from '@/src/lib/revalidate'

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  if (!secret) {
    return Response.json({revalidated: false, message: 'Missing SANITY_REVALIDATE_SECRET'}, {status: 500})
  }

  const body = await request.text()
  const signature = request.headers.get(SIGNATURE_HEADER_NAME)

  if (!signature) {
    return Response.json({revalidated: false, message: 'Missing Sanity signature'}, {status: 401})
  }

  const isValid = await isValidSignature(body, signature, secret)

  if (!isValid) {
    return Response.json({revalidated: false, message: 'Invalid Sanity signature'}, {status: 401})
  }

  const payload = (() => {
    try {
      return JSON.parse(body || 'null') as SanityWebhookPayload | null
    } catch {
      return null
    }
  })()

  if (!payload?._type) {
    return Response.json({revalidated: false, message: 'Missing document type'}, {status: 400})
  }

  const tags = tagsForWebhookPayload(payload)

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return Response.json({
    revalidated: tags.length > 0,
    tags,
    type: payload._type,
  })
}
