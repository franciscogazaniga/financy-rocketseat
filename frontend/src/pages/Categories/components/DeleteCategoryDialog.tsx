import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMutation } from "@apollo/client/react"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category
}: DeleteCategoryDialogProps) {
  const [ deleteCategory, { loading } ] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [LIST_CATEGORIES],
    onCompleted() {
      toast.success("Categoria deletada com sucesso!")
      onOpenChange(false)
    },
    onError(error) {
      const err = error as any

      const graphQLError =
        err?.cause?.errors?.[0]?.message

      toast.error(graphQLError ?? error.message)
    }
  })

  const handleDelete = () => {
    deleteCategory({
      variables: {
        id: category.id,
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-2'>
        <DialogHeader>
          <DialogTitle>
            Deletar categoria
          </DialogTitle>

          <DialogDescription>
            Tem certeza que deseja deletar a categoria {category.title}?
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5 mt-6">
          <div className="flex flex-row gap-8">
            <Button
              className="w-full"
              type="submit"
              disabled={loading}
              onClick={() => handleDelete()}
            >
              Sim
            </Button>
            <Button 
              className="w-full" 
              variant={"secondary"}
              type="button"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Não
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}