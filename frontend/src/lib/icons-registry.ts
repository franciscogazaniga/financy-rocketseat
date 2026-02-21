import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  HelpCircle,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Tag,
  Ticket,
  ToolCase,
  Utensils,
  TreePalm,
  Hamburger,
  Shirt,
  Smile,
} from "lucide-react"

export const ICON_REGISTRY = {
  "baggage-claim": BaggageClaim,
  "book-open": BookOpen,
  "briefcase-business": BriefcaseBusiness,
  "car-front": CarFront,
  "dumbbell": Dumbbell,
  "gift": Gift,
  "heart-pulse": HeartPulse,
  "house": House,
  "mailbox": Mailbox,
  "paw-print": PawPrint,
  "piggy-bank": PiggyBank,
  "receipt-text": ReceiptText,
  "shopping-cart": ShoppingCart,
  "tag": Tag,
  "ticket": Ticket,
  "tool-case": ToolCase,
  "utensils": Utensils,
  "tree-palm": TreePalm,
  "hamburger": Hamburger,
  "shirt": Shirt,
  "smile": Smile, 
} as const

export type CategoryIconName = keyof typeof ICON_REGISTRY

export const FALLBACK_ICON = HelpCircle

export function getCategoryIcon(iconName?: string) {
  if (!iconName) return FALLBACK_ICON

  return (
    ICON_REGISTRY[iconName as CategoryIconName] ??
    FALLBACK_ICON
  )
}