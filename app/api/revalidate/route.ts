import {revalidateTag} from 'next/cache'
import type {NextRequest} from 'next/server'
import {tagsForWebhookPayload, type SanityWebhookPayload} from '@/src/lib/revalidate'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-sanity-revalidate-secret') || request.nextUrl.searchParams.get('secret')

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({revalidated: false, message: 'Invalid secret'}, {status: 401})
  }

  const payload = (await request.json().catch(() => null)) as SanityWebhookPayload | null

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
