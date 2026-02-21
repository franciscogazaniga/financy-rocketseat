import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Plus, Tag, Utensils } from "lucide-react"
import { Card } from "./components/Card";
import { CategoryCard } from "./components/CategoryCard";
import { useQuery } from "@apollo/client/react";
import type { Category, CategoryWithStats, TransactionsStats } from "@/types";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category";
import { useDialog } from "@/providers/DialogProvider";
import { GET_TRANSACTIONS_STATS } from "@/lib/graphql/queries/Transaction";

export function Category() {
  const { openDialog } = useDialog()
  const { data: categoriesData, loading } = useQuery<{ listCategoriesWithStats: CategoryWithStats[] }>(LIST_CATEGORIES)
  const categories = categoriesData?.listCategoriesWithStats || []

  const { data: transactionsStatsData } = useQuery<{ getTransactionsStats: TransactionsStats }>(GET_TRANSACTIONS_STATS, {
    fetchPolicy: "network-only"
  })

  const transactionsStats = transactionsStatsData?.getTransactionsStats

  return(
    <Page>
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <Label className="text-title-primary text-2xl">
              Categorias
            </Label>

            <span className="text-foreground text-base">
              Organize suas transações por categorias
            </span>
          </div>


          <Button
            onClick={() =>
              openDialog({
                type: "createCategory"
              })
            }>
            <Plus className="mr-2 h-4 w-4"/>
            Nova categoria
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <Card 
          icon={<Tag className="text-gray-700" />}
          content={categories.length.toString()}
          description="Total de categorias"
        />

        <Card 
          icon={<ArrowUpDown className="text-purple-base"/>}
          content={transactionsStats?.total?.toString() ?? "0"}
          description="Total de transações"
        />

        <Card 
          icon={<Utensils className="text-blue-base"/>}
          content={transactionsStats?.mostUsedCategoryName ?? "-"}
          description="Categoria mais utilizada"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
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
         !loading && categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            numberOfTransactions={category.transactionsCount}
          />
         ))
        }
      </div>
    </Page>
  )
}