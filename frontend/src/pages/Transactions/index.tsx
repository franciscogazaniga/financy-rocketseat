import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react"
import { CreateTransactionDialog } from "./components/CreateTransactionDialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@apollo/client/react";
import type { Transaction } from "@/types";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction";
import { TransactionRow } from "../Dashboard/components/TransactionRow";
import { TransactionTable } from "./components/TransactionTable";

export function Transaction() {
  const [openDialog, setOpenDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { data, loading, refetch } = useQuery<{ getTransactions: Transaction[] }>(LIST_TRANSACTIONS)

  const transactions = data?.getTransactions || []

  return(
    <Page>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-title-primary text-2xl">
              Transações
            </Label>

            <span className="text-foreground text-base">
              Gerencie todas as suas transações financeiras
            </span>
          </div>


          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4"/>
            Nova transação
          </Button>
        </div>

        <CreateTransactionDialog 
          open={openDialog}
          onOpenChange={setOpenDialog}
        />

        <div className="flex flex-row justify-between bg-white border border-border rounded-[8px] p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">
              Buscar
            </Label>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input
                id="search"
                placeholder="Buscar por descrição"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 max-w-[200px]"
              />
            </div>

          </div>
        </div>

        <div className="grid grid-cols-4">
          {
            loading && 
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`category-skeleton-${i}`}
                className="h-32 rounded-[8px] border border-dashed border-border/30"
              />
            ))
          }
  
          {
            !loading &&
            <TransactionTable data={transactions}/>
          }
        </div>
      </div>
    </Page>
  )
}