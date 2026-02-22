export function truncateText(text?: string, max?: number) {
  const caracterLimit = max ?? 20

  if(!text) {
    return ""
  }

  return text.length > caracterLimit
    ? text.slice(0, caracterLimit) + "..."
    : text
}