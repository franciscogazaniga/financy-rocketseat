export const CATEGORY_COLORS = {
  green: {
    text: "text-green-dark",
    bg: "bg-green-light",
    icon: "text-green-base",
    base: "bg-green-base"
  },
  blue: {
    text: "text-blue-dark",
    bg: "bg-blue-light",
    icon: "text-blue-base",
    base: "bg-blue-base"
  },
  purple: {
    text: "text-purple-dark",
    bg: "bg-purple-light",
    icon: "text-purple-base",
    base: "bg-purple-base"
  },
  pink: {
    text: "text-pink-dark",
    bg: "bg-pink-light",
    icon: "text-pink-base",
    base: "bg-pink-base"
  },
  red: {
    text: "text-red-dark",
    bg: "bg-red-light",
    icon: "text-red-base",
    base: "bg-red-base"
  },
  orange: {
    text: "text-orange-dark",
    bg: "bg-orange-light",
    icon: "text-orange-base",
    base: "bg-orange-base"
  },
  yellow: {
    text: "text-yellow-dark",
    bg: "bg-yellow-light",
    icon: "text-yellow-base",
    base: "bg-yellow-base"
  },
} as const

export type CategoryColor = keyof typeof CATEGORY_COLORS

export function getCategoryColor(color?: string) {
  if (!color) return CATEGORY_COLORS["green"]

  return (
    CATEGORY_COLORS[color as CategoryColor] ??
    CATEGORY_COLORS["green"]
  )
}