interface CardProps {
  icon: React.ReactNode
  title: string
  value: string
}

export function Card({icon, title, value}: CardProps) {
  return (
    <div className="flex flex-col w-96 bg-white border border-border rounded-[8px] gap-4 p-6">
      <div className="flex flex-row text-title-secondary text-xs uppercase">
        {icon}
        <span>{title}</span>
      </div>

      <div className="text-title-primary text-2xl font-medium">
        <span>R$ {value}</span>
      </div>
    </div>
  )
}