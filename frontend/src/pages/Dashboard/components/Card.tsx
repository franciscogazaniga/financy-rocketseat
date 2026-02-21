import { formatCurrency } from "@/utils/formatCurrency"

interface CardProps {
  icon: React.ReactNode
  title: string
  value: number
}

export function Card({icon, title, value}: CardProps) {
  const formattedValue = formatCurrency(value)

  return (
    <div className="w-full flex flex-col bg-white border border-border rounded-[8px] gap-4 p-6">
      <div className="flex flex-row text-title-secondary text-xs uppercase">
        {icon}
        <span>{title}</span>
      </div>

      <div className={`${value < 0 ? "text-red-600" : "text-title-primary"}  text-2xl font-medium`}>
        <span>{formattedValue}</span>
      </div>
    </div>
  )
}