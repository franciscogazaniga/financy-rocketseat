import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMutation } from "@apollo/client/react"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/types"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transaction"

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  transaction
}: DeleteTransactionDialogProps) {
  const [ deleteTransaction, { loading } ] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [LIST_TRANSACTIONS],
    onCompleted() {
      toast.success("Transação deletada com sucesso!")
      onOpenChange(false)
    },
    onError() {
      toast.error("Falha ao deletar a transação.")
    }
  })

  const handleDelete = () => {
    deleteTransaction({
      variables: {
        id: transaction.id,
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-2'>
        <DialogHeader>
          <DialogTitle>
            Deletar transação
          </DialogTitle>

          <DialogDescription>
            Tem certeza que deseja deletar a transação {transaction.description}?
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