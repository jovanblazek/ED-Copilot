const MAX_EMBED_DESCRIPTION_LENGTH = 3800 // Added some buffer to be safe

/**
 * Splits text into chunks that fit within Discord embed description limits
 * Useful when you need to use markdown, but embed field titles do not support it
 */
export const chunkDescription = (
  lines: string[],
  maxLength: number = MAX_EMBED_DESCRIPTION_LENGTH
): string[] => {
  const chunks: string[] = []
  let currentChunk = ''

  for (const line of lines) {
    const lineWithNewlines = `${line}\n\n`

    if (currentChunk.length + lineWithNewlines.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim())
        currentChunk = ''
      }
    }

    currentChunk += lineWithNewlines
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}
