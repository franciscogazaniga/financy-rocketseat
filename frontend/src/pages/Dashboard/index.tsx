import { Page } from "@/components/Page";
import { Briefcase, ChevronRight, CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react"
import { useState } from "react";
import { Card } from "./components/Card";
import { TransactionRow } from "./components/TransactionRow";
import { CategoryRow } from "./components/CategoryRow";
import { useQuery } from "@apollo/client/react";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction";
import type { Transaction } from "@/types";

export function Dashboard() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data, loading, refetch } = useQuery<{listTransactions: Transaction[]}>(LIST_TRANSACTIONS)
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)

  const transactions = data?.listTransactions || []

  return(
    <Page>
      <div className="space-y-6">
        <div className="flex justify-between">
          <Card icon={<Wallet className="mr-2 h-4 w-4 text-purple-base" />} title="Saldo total" value="1284732"/>
          <Card icon={<CircleArrowUp className="mr-2 h-4 w-4 text-green-base" />} title="Receitas do mês" value="1284732"/>
          <Card icon={<CircleArrowDown className="mr-2 h-4 w-4 text-red-base" />} title="Despesas do mês" value="1284732"/>
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-6 bg-white border border-border rounded-[8px] py-6">
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
              <div className="flex flex-row justify-between px-6 border-b border-border pb-6">
                <span className="text-title-secondary text-xs uppercase">Categorias</span>
                <div className="flex flex-row text-brand-base text-xs">
                  <span>Gerenciar</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              <div className="w-96">
                <CategoryRow
                  title="Alimentação"
                  numberOf={12}
                  value="20000"
                />
              </div>
            </div>
          </div>
        </div>



      </div>
    </Page>
  )
}