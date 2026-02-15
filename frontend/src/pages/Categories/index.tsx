import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Plus, Tag, Utensils } from "lucide-react"
import { useState } from "react";
import { CreateCategoryDialog } from "./components/CreateCategoryDialog";
import { Card } from "./components/Card";
import { CategoryCard } from "./components/CategoryCard";
import { useQuery } from "@apollo/client/react";
import type { Category } from "@/types";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category";

export function Category() {
  const [openDialog, setOpenDialog] = useState(false)
  const { data, loading, refetch } = useQuery<{ getCategories: Category[] }>(LIST_CATEGORIES)

  const categories = data?.getCategories || []

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


          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4"/>
            Nova categoria
          </Button>
        </div>

        <CreateCategoryDialog 
          open={openDialog}
          onOpenChange={setOpenDialog}
          onCreated={() => refetch()}
        />
      </div>

      <div className="flex flex-row justify-between">
        <Card 
          icon={<Tag className="text-gray-700" />}
          content="4"
          description="Total de categorias"
        />

        <Card 
          icon={<ArrowUpDown className="text-purple-base"/>}
          content="4"
          description="Total de categorias"
        />

        <Card 
          icon={<Utensils className="text-blue-base"/>}
          content="Alimentação"
          description="Categoria mais utilizada"
        />
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
         !loading && categories.map((category) => (
          <CategoryCard
            title={category.title}
            description={category.description}
            color={category.color}
            icon={category.icon}
            numberOfTransactions={category.transactionsCount}
          />
         ))
        }
      </div>
    </Page>
  )
}