import { getCategoryColor } from "@/lib/colors-registry"
import { TRANSACTION_TYPE_CONFIG } from "@/lib/config/transaction-type.config"
import { getCategoryIcon } from "@/lib/icons-registry"
import type { Transaction } from "@/types"
import { formatCurrencyFromString } from "@/utils/formatCurrency"

interface TransactionRowProps {
  transaction: Transaction
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const formattedValue = formatCurrencyFromString(transaction.value.toString())

  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(transaction.date))

  const type = TRANSACTION_TYPE_CONFIG[transaction.type]
  const IconType = type.Icon

  const CategoryIcon = getCategoryIcon(transaction.category?.icon)
  const categoryColor = getCategoryColor(transaction.category?.color)

  return(
    <div className="flex justify-between py-4 border-t border-border last:border-b">
      <div className="flex flex-row gap-4 px-6">
        <div className={`${categoryColor.bg} border border-transparent rounded-[8px] p-3`}>
          {<CategoryIcon className={`${categoryColor.bg} ${categoryColor.icon} h-4 w-4`}/>}
        </div>

        <div className="flex flex-col gap-[2px]">
          <span className="text-title-primary text-base">{transaction.description}</span>
          <span className="text-foreground text-sm">{date}</span>
        </div>
      </div>

      <div className="flex flex-row items-center gap-11 px-6">
        <div className={`text-sm ${categoryColor.bg} ${categoryColor.text} py-1 px-3 rounded-full`}>
          <span>{transaction.category?.title}</span>
        </div>

        <div className="text-title-primary text-sm font-medium items-center justify-center">
          <div className="flex flex-row gap-2 items-center">
            <span>
              {type.prefix} {formattedValue}
            </span>

            <IconType className={`h-4 w-4 ${type.color}`} />
          </div>
        </div>

        </div>
      </div>
  )
}