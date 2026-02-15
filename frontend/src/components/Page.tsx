interface PageProps {
  children: React.ReactNode
}

export function Page({ children }: PageProps) {
  return(
    <div className="flex flex-col gap-8 min-h-[calc(100vh - 9rem)] p-12">
      {children}
    </div>
  )
}