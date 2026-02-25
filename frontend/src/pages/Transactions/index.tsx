import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@apollo/client/react";
import type { Category, PaginatedTransactions, Transaction } from "@/types";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction";
import { TransactionTable } from "./components/TransactionTable";
import { cn } from "@/lib/utils";
import { useDialog } from "@/providers/DialogProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GET_CATEGORIES } from "@/lib/graphql/queries/Category";
import { TRANSACTION_TYPE_CONFIG } from "@/lib/config/transaction-type.config";
import { truncateText } from "@/utils/truncateText";
import { mockPaginatedTransactions } from "@/mocks/transactions";
import { mockGetCategories } from "@/mocks/categories";

const IS_MOCK = import.meta.env.VITE_USE_MOCK === "true"

export function Transaction() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 400)
  const [searchQueryIsFocused, setSearchQueryIsFocused] = useState(false)
  const [searchCategoryId, setSearchCategoryId] = useState<string | undefined>()
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [searchType, setSearchType] = useState<string | undefined>()
  const { openDialog } = useDialog()
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  function getMonthRange(month?: string) {
    if (!month || month === "all") return {}

    const [year, monthIndex] = month.split("-").map(Number)

    const startDate = new Date(Date.UTC(year, monthIndex - 1, 1))
    const endDate = new Date(Date.UTC(year, monthIndex, 1)) 

    return {
      startDate,
      endDate
    }
  }
  const dateRange = useMemo(
    () => getMonthRange(selectedMonth),
    [selectedMonth]
  )

  const variables = useMemo(() => ({
    input: {
      description: debouncedSearch || undefined,
      type: searchType,
      categoryId: searchCategoryId,
      startDate: dateRange.startDate?.toISOString(),
      endDate: dateRange.endDate?.toISOString(),
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize
    }
  }), [debouncedSearch, pagination, searchType, searchCategoryId, dateRange])

  const { data: transactionsData, loading: queryLoading } = useQuery<{ listTransactions: PaginatedTransactions }>(LIST_TRANSACTIONS, {
      variables,
      skip: IS_MOCK,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first"
  })

  const loading = IS_MOCK ? false : queryLoading
  
  const finalTransactionsData = IS_MOCK
  ? (() => {
      const page = pagination.pageIndex + 1
      const limit = pagination.pageSize

      const start = (page - 1) * limit
      const end = start + limit

      const paginatedData =
        mockPaginatedTransactions.listTransactions.data.slice(start, end)

      return {
        listTransactions: {
          ...mockPaginatedTransactions.listTransactions,
          data: paginatedData,
          page,
          total: mockPaginatedTransactions.listTransactions.data.length,
          totalPages: Math.ceil(
            mockPaginatedTransactions.listTransactions.data.length / limit
          )
        }
      }
    })()
  : transactionsData

  const transactions = finalTransactionsData?.listTransactions.data || []

  const { data: categoriesData } = useQuery<{ getCategories: Category[] }>(GET_CATEGORIES, {
    skip: IS_MOCK,
  })

  const categories =
    (IS_MOCK
      ? mockGetCategories.getCategories
      : categoriesData?.getCategories) ?? []

  const types = TRANSACTION_TYPE_CONFIG

  function generateMonthOptions(totalMonths = 12) {
    const now = new Date()

    return Array.from({ length: totalMonths }).map((_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)

      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`

      const month = date.toLocaleDateString("pt-BR", {
        month: "long"
      })

      const capitalizedMonth =
        month.charAt(0).toUpperCase() + month.slice(1)

      const label = `${capitalizedMonth} / ${date.getFullYear()}`

      return { value, label }
    })
  }
  const monthOptions = useMemo(() => generateMonthOptions(12), [])

  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      pageIndex: 0
    }))
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

        <div className="flex flex-row justify-between bg-white border border-border rounded-[8px] p-6 gap-4">
          <div className="w-full flex flex-col gap-2">
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
                "pl-9",
                searchQueryIsFocused && "text-title-primary",
                !!searchQuery && !searchQueryIsFocused && "text-title-primary",
                !searchQuery && !searchQueryIsFocused && "text-gray-400"
              )}
              />
            </div>

          </div>

          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="category">
              Tipo
            </Label>
            <Select 
              value={searchType ?? "all"} 
              onValueChange={(value) => {
                const newValue = value === "all" ? undefined : value

                setSearchType(newValue)
                console.log("searchType", searchType)
                setPagination(prev => ({
                  ...prev,
                  pageIndex: 0
                }))
              }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos
                </SelectItem>
                {Object.entries(types).map(([key, type]) => (
                  <SelectItem key={key} value={type.name}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="category">
              Categoria
            </Label>
            <Select 
              value={searchCategoryId ?? "all"} 
              onValueChange={(value) => {
                const newValue = value === "all" ? undefined : value
                setSearchCategoryId(newValue)
                setPagination(prev => ({
                  ...prev,
                  pageIndex: 0
                }))
              }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todas
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {truncateText(cat.title,40)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label htmlFor="category">
              Período
            </Label>
            <Select 
              value={selectedMonth}
              onValueChange={(value) => {
                setSelectedMonth(value)
                setPagination(prev => ({
                  ...prev,
                  pageIndex: 0
                }))
              }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos
                </SelectItem>
                {monthOptions.map(m => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              total={finalTransactionsData?.listTransactions.total}
              totalPages={finalTransactionsData?.listTransactions.totalPages}
              pagination={pagination}
              onPaginationChange={setPagination}
            />
          }
        </div>
      </div>
    </Page>
  )
}