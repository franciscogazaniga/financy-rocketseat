import { Header } from "./Header"
import { Toaster } from "./ui/sonner"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return(
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto px-16 py-4">
        {children}
      </main>
      <Toaster />
    </div>
  )
}