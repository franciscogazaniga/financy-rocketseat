import { Page } from "@/components/Page";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react"
import { Card } from "./components/Card";
import { TransactionRow } from "./components/TransactionRow";
import { CategoryRow } from "./components/CategoryRow";
import { useQuery } from "@apollo/client/react";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction";
import type { CategoryWithStats, PaginatedTransactions } from "@/types";
import { useMemo } from "react";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/providers/DialogProvider";
import { Link } from "react-router-dom";
import { mockCategoriesWithStats } from "@/mocks/categories";
import { mockPaginatedTransactions } from "@/mocks/transactions";

const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true"

export function Dashboard() {
  const { openDialog } = useDialog()
  const variables = useMemo(() => {
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1) // 1º dia do mês
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999) // último dia do mês às 23:59:59

    return {
      input: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 5,
      }
    }
  }, [])

  const { data: transactionsData } = useQuery<{ listTransactions: PaginatedTransactions }>(LIST_TRANSACTIONS, {
      variables,
      skip: IS_MOCK,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first"
  })

  const finalTransactionsData = IS_MOCK
  ? {
      listTransactions: {
        ...mockPaginatedTransactions.listTransactions,
        data: mockPaginatedTransactions.listTransactions.data.slice(
          0,
          variables.input.limit
        )
      }
    }
  : transactionsData

  const transactions = finalTransactionsData?.listTransactions.data || []

  const { data: categoriesData } = useQuery<{
    listCategoriesWithStats: CategoryWithStats[]
  }>(LIST_CATEGORIES, {
    skip: IS_MOCK
  })

  const categories: CategoryWithStats[] = IS_MOCK
    ? mockCategoriesWithStats.listCategoriesWithStats
    : categoriesData?.listCategoriesWithStats ?? []

  const topCategories = categories
  .slice()
  .sort((a, b) => b.transactionsCount - a.transactionsCount) // ordena do mais usado
  .slice(0, 5)

  return(
    <Page>
      <div className="space-y-6">
        <div className="flex justify-between gap-6">
          <Card icon={<Wallet className="mr-2 h-4 w-4 text-purple-base" />} title="Saldo total" value={finalTransactionsData?.listTransactions.totalValue ?? 0}/>
          <Card icon={<CircleArrowUp className="mr-2 h-4 w-4 text-green-base" />} title="Receitas do mês" value={finalTransactionsData?.listTransactions.totalIncome ?? 0}/>
          <Card icon={<CircleArrowDown className="mr-2 h-4 w-4 text-red-base" />} title="Despesas do mês" value={finalTransactionsData?.listTransactions.totalExpense ?? 0}/>
        </div>

        <div className="flex flex-row justify-between gap-6 items-start">
          <div className="w-full flex flex-col gap-6 bg-white border border-border rounded-[8px] py-6">
            <div className="flex flex-row justify-between px-6">
              <span className="text-title-secondary text-xs uppercase">Transações Recentes</span>
              <div className="flex flex-row text-brand-base text-xs">
                <Link to="/transactions">
                  <Button
                    size="sm"
                    variant={"outline"}
                  >
                    Ver todas
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div>
              {transactions?.length ? (
                transactions.map((transaction) => (
                  <TransactionRow 
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                  <div className="flex items-center justify-center text-foreground text-sm font-light border-y border-border p-8">
                    Nenhuma transação registrada
                  </div>
                )
              }
            </div>

            <div className="flex items-center justify-center font-medium text-brand-base hover:text-dark-base">
              <Button variant={"outline"}
                onClick={() =>
                openDialog({
                  type: "createTransaction"
                })
              }>
                <Plus className="w-5 h-5"/> Nova transação
              </Button>
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6 bg-white border border-border rounded-[8px] py-6">
              <div className="w-full flex flex-row justify-between px-6 border-b border-border pb-6">
                <span className="text-title-secondary text-xs uppercase">Categorias</span>
                <div className="flex flex-row text-brand-base text-xs">
                  <Link to="/categories">
                    <Button
                      size="sm"
                      variant={"outline"}
                    >
                      Gerenciar
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-96">
                { categories?.length ? (
                  topCategories.map((category) => (
                    <CategoryRow
                      category={category}
                      totalValue={category.totalValue}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center text-foreground text-sm font-light p-8">
                    Nenhuma categoria registrada
                  </div>
                )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}