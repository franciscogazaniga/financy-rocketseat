import { getCategoryColor } from "@/lib/colors-registry"
import type { Category } from "@/types"
import { formatCurrency } from "@/utils/formatCurrency"

interface CategoryRowProps {
  category: Category
  totalValue: string
}

export function CategoryRow({ category, totalValue }: CategoryRowProps) {
  const formattedValue = formatCurrency(totalValue)
  const categoryColor = getCategoryColor(category?.color)

  return(
    <div className="flex justify-between py-4">
      <div className="flex flex-row gap-4 px-6">
        <div className={`text-sm ${categoryColor.bg} ${categoryColor.text} border border-transparent rounded-full py-1 px-3`}>
          {category.title}
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 px-6">
        <div className="text-sm text-foreground">
          <span>{category.transactionsCount} itens</span>
        </div>

          <div className="text-title-primary font-medium text-sm flex flex-row gap-2 items-center">
            <span>
              {formattedValue}
            </span>

          </div>
        </div>
      </div>
  )
}