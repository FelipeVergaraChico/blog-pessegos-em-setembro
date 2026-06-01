const allowedProtocols = new Set(['http:', 'https:', 'mailto:'])

export function safeHref(href: unknown) {
  if (typeof href !== 'string') {
    return undefined
  }

  const trimmed = href.trim()

  if (!trimmed || /[\u0000-\u001F\u007F]/.test(trimmed)) {
    return undefined
  }

  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  if (trimmed.startsWith('#')) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)
    return allowedProtocols.has(url.protocol) ? trimmed : undefined
  } catch {
    return undefined
  }
}
