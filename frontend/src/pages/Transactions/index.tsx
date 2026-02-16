import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@apollo/client/react";
import type { PaginatedTransactions, Transaction } from "@/types";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction";
import { TransactionTable } from "./components/TransactionTable";
import { cn } from "@/lib/utils";
import { useDialog } from "@/providers/DialogProvider";
import { useDebounce } from "@/hooks/useDebounce";

export function Transaction() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 400)
  const [searchQueryIsFocused, setSearchQueryIsFocused] = useState(false)
  const { openDialog } = useDialog()
  const [ page, setPage ] = useState(1)

  const pageLimit = 10

  const variables = useMemo(() => ({
    input: {
      description: debouncedSearch || undefined,
      limit: pageLimit,
      page
    }
  }), [debouncedSearch, page])

  const { data, loading } = useQuery<{ listTransactions: PaginatedTransactions }>(LIST_TRANSACTIONS, {
      variables,
      notifyOnNetworkStatusChange: true,
      // returnPartialData: true
  })

  const transactions = data?.listTransactions.data || []

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

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

          <Button variant={"default"}
            onClick={() =>
              openDialog({
                type: "createTransaction"
              })
            }>
            <Plus className="mr-2 h-4 w-4"/>
            Nova transação
          </Button>
        </div>

        <div className="flex flex-row justify-between bg-white border border-border rounded-[8px] p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="search">
              Buscar
            </Label>

            <div className="relative flex-1">
              <Search className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                searchQueryIsFocused && "text-brand-base",
                !!searchQuery && !searchQueryIsFocused && "text-title-primary",
                !searchQuery && !searchQueryIsFocused && "text-gray-400"
              )}/>
              <Input
                id="search"
                placeholder="Buscar por descrição"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchQueryIsFocused(true)}
                onBlur={() => setSearchQueryIsFocused(false)}
                className={cn(
                "pl-9 max-w-[200px]",
                searchQueryIsFocused && "text-title-primary",
                !!searchQuery && !searchQueryIsFocused && "text-title-primary",
                !searchQuery && !searchQueryIsFocused && "text-gray-400"
              )}
              />
            </div>

          </div>
        </div>

        <div className="bg-white py-5 border border-border rounded-[8px]">
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
            <TransactionTable
              data={transactions}
              total={data?.listTransactions.total}
              page={data?.listTransactions.page}
              pageLimit={pageLimit}
              totalPages={data?.listTransactions.totalPages}
              onPageChange={setPage}
            />
          }
        </div>
      </div>
    </Page>
  )
}