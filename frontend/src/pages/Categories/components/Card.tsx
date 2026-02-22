import { truncateText } from "@/utils/truncateText"

interface CardProps {
  icon: React.ReactNode
  description: string
  content: string
}

export function Card({icon, description, content}: CardProps) {
  return (
    <div className="flex flex-row w-96 bg-white border border-border rounded-[8px] gap-4 p-6">
      <div className="w-6 h-6">
        {icon}
      </div>
      <div className="flex flex-col gap-1 text-title-primary text-2xl font-medium">
        <span className="text-[28px] text-title-primary">{truncateText(content, 25)}</span>
        <span className="text-xs text-title-secondary uppercase">{description}</span>
      </div>
    </div>
  )
}