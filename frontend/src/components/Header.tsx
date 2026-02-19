import { useAuthStore } from "@/stores/auth"
import logo from "@/assets/Logo.svg"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { getInitials } from "@/utils/getInitials"

export function Header() {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  const isDashboardPage = location.pathname === "/"
  const isTransactionsPage = location.pathname === "/transactions"
  const isCategoriesPage = location.pathname === "/categories"
  const isAccountPage = location.pathname === "/account"

  return(
    <div className="w-full bg-white px-16 py-6 border border-b-border">
      {isAuthenticated && (
        <div className="flex items-center justify-between w-full">
          <div className="min-w-48">
            <img src={logo} className="h-6" />
          </div>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                size="sm"
                className="gap-2"
                variant={isDashboardPage ? "link" : "ghost"}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/transactions">
              <Button
                size="sm"
                className="gap-2"
                variant={isTransactionsPage ? "link" : "ghost"}
              >
                Transações
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                size="sm"
                className="gap-2"
                variant={isCategoriesPage ? "link" : "ghost"}
              >
                Categorias
              </Button>
            </Link>
          </div>

          <div className="flex items-center">
            <Link to="/account">
              <Button
                size="sm"
                className="gap-2"
                variant={isAccountPage ? "link" : "ghost"}
              >
                <Avatar>
                  <AvatarFallback className="bg-gray-300 text-title-primary">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
  

          </div>
        </div>
      )}
    </div>
  )
}