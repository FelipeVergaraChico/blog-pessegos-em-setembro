export function readingTime(input = '') {
  const words = input.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 220))

  return `${minutes} min de leitura`
}
