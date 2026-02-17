import { Page } from "@/components/Page";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react"
import { Card } from "./components/Card";
import { TransactionRow } from "./components/TransactionRow";
import { CategoryRow } from "./components/CategoryRow";
import { useQuery } from "@apollo/client/react";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction";
import type { Category, PaginatedTransactions } from "@/types";
import { useMemo } from "react";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category";

export function Dashboard() {
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
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first"
  })
  const transactions = transactionsData?.listTransactions.data || []

  const { data: categoriesData } = useQuery<{ getCategories: Category[] }>(LIST_CATEGORIES)
  const categories = categoriesData?.getCategories || []

  return(
    <Page>
      <div className="space-y-6">
        <div className="flex justify-between gap-6">
          <Card icon={<Wallet className="mr-2 h-4 w-4 text-purple-base" />} title="Saldo total" value={transactionsData?.listTransactions.totalValue.toString() ?? "0"}/>
          <Card icon={<CircleArrowUp className="mr-2 h-4 w-4 text-green-base" />} title="Receitas do mês" value={transactionsData?.listTransactions.totalIncome.toString() ?? "0"}/>
          <Card icon={<CircleArrowDown className="mr-2 h-4 w-4 text-red-base" />} title="Despesas do mês" value={transactionsData?.listTransactions.totalExpense.toString() ?? "0"}/>
        </div>

        <div className="flex flex-row justify-between gap-6">
          <div className="w-full flex flex-col gap-6 bg-white border border-border rounded-[8px] py-6">
            <div className="flex flex-row justify-between px-6">
              <span className="text-title-secondary text-xs uppercase">Transações Recentes</span>
              <div className="flex flex-row text-brand-base text-xs">
                <span>Ver todas</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <div>
              {
                transactions.map((transaction) => (
                  <TransactionRow 
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              }
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-6 bg-white border border-border rounded-[8px] py-6">
              <div className="w-full flex flex-row justify-between px-6 border-b border-border pb-6">
                <span className="text-title-secondary text-xs uppercase">Categorias</span>
                <div className="flex flex-row text-brand-base text-xs">
                  <span>Gerenciar</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              <div className="w-96">
                {
                  categories.map((category) => (
                    <CategoryRow
                      category={category}
                      totalValue={"0"}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        </div>



      </div>
    </Page>
  )
}