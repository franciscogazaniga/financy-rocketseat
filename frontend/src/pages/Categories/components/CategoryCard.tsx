import { getCategoryColor } from "@/lib/colors-registry"
import { getCategoryIcon, type ICON_REGISTRY } from "@/lib/icons-registry"
import { Icon, SquarePen, Trash, type IconNode } from "lucide-react"

interface CardProps {
  icon: string
  color: string
  title: string
  description?: string | null
  numberOfTransactions: number
}

export function CategoryCard({icon, color, title, description, numberOfTransactions}: CardProps) {
  const CategoryIcon = getCategoryIcon(icon)
  const categoryColor = getCategoryColor(color)

  return (
    <div className="flex flex-col max-w-72 bg-white border border-border rounded-[8px] gap-5 p-6">
      <div className="flex flex-row items-center justify-between">
        <div className={`p-3 rounded-[8px] ${categoryColor.bg}`}>
          <CategoryIcon className={`w-4 h-4 ${categoryColor.text}`} />
        </div>

        <div className="flex flex-row gap-2">
          <button className="p-2 border rounded-[8px]">
            <Trash className="w-4 h-4 text-danger"/>
          </button>
          <button className="p-2 border rounded-[8px]">
            <SquarePen className="w-4 h-4 text-gray-700"/>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-title-primary text-2xl font-medium">
        <span className="text-base text-title-primary">{title}</span>
        <span className="text-sm text-foreground">{description}</span>
      </div>

      <div className="flex flex-row items-center justify-between gap-1 text-title-primary text-2xl font-medium">
        <span className={`text-sm px-3 py-1 rounded-full ${categoryColor.text} ${categoryColor.bg}`}>{title}</span>
        <span className="text-sm text-foreground">{numberOfTransactions} itens</span>
      </div>
    </div>
  )
}