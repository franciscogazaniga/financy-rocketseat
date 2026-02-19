export function getInitials(name: string) {
  const ignore = ["de", "da", "do", "dos", "das"]

  const parts = name
    .trim()
    .split(" ")
    .filter(p => p && !ignore.includes(p.toLowerCase()))

  if (!parts.length) return ""

  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""

  return (first + last).toUpperCase()
}