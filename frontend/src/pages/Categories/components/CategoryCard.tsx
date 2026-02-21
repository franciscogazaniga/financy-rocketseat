import { getCategoryColor } from "@/lib/colors-registry"
import { getCategoryIcon } from "@/lib/icons-registry"
import { useDialog } from "@/providers/DialogProvider"
import type { Category } from "@/types"
import { SquarePen, Trash } from "lucide-react"

interface CardProps {
  category: Category
  numberOfTransactions: number
}

export function CategoryCard({category, numberOfTransactions}: CardProps) {
  const CategoryIcon = getCategoryIcon(category.icon)
  const categoryColor = getCategoryColor(category.color)
  const { openDialog } = useDialog()

  return (
    <div className="flex flex-col justify-between max-w-72 bg-white border border-border rounded-[8px] gap-5 p-6">
      <div className="flex flex-row items-center justify-between">
        <div className={`p-3 rounded-[8px] ${categoryColor.bg}`}>
          <CategoryIcon className={`w-4 h-4 ${categoryColor.text}`} />
        </div>

        <div className="flex flex-row gap-2">
          <button 
            className="p-2 border rounded-[8px]"
            onClick={() => {
              openDialog({
                type: "deleteCategory",
                data: { category }
              })
            }}
          >
            <Trash className="w-4 h-4 text-danger"/>
          </button>
          <button 
            className="p-2 border rounded-[8px]"
            onClick={() => {
              openDialog({
                type: "updateCategory",
                data: { category }
              })
            }}
          >
            <SquarePen className="w-4 h-4 text-gray-700"/>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-title-primary text-2xl font-medium">
        <span className="text-base text-title-primary">{category.title}</span>
        <span className="text-sm text-foreground">{category.description}</span>
      </div>

      <div className="flex flex-row items-center justify-between gap-1 text-title-primary text-2xl font-medium">
        <span className={`text-sm px-3 py-1 rounded-full ${categoryColor.text} ${categoryColor.bg}`}>{category.title}</span>
        <span className="text-sm text-foreground">{numberOfTransactions} {numberOfTransactions > 1 ? "itens" : "item"}</span>
      </div>
    </div>
  )
}