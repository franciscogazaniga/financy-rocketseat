import { CircleArrowDown, CircleArrowUp } from "lucide-react"

interface CategoryRowProps {
  title: string
  numberOf: number
  value: string
}

export function CategoryRow({ title, numberOf, value }: CategoryRowProps) {
  return(
    <div className="flex justify-between py-4">
      <div className="flex flex-row gap-4 px-6">
        <div className="text-sm bg-blue-light text-blue-base border border-transparent rounded-full py-1 px-3">
          {title}
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 px-6">
        <div className="text-sm text-foreground">
          <span>{numberOf} itens</span>
        </div>

          <div className="text-title-primary font-medium text-sm flex flex-row gap-2 items-center">
            <span>
              R$ {value}
            </span>

          </div>
        </div>
      </div>
  )
}