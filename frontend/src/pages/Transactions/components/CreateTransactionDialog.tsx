import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface CreateTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
}: CreateTransactionDialogProps) {
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [date, setDate] = useState("")
  const [value, setValue] = useState("")
  const [category, setCategory] = useState("")

  const [ createTransaction, { loading } ] = useMutation(CREATE_TRANSACTION, {
    onCompleted() {
      toast.success("Transaction criada com sucesso!")
      onOpenChange(false)
    },
    onError() {
      toast.error("Falha ao criar a transação.")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createTransaction({
      variables: {
        data: {
          description,
          value,
          type,
          date,
        }
      }
    })
  }

  const handleCancel = () => {
    setDescription("")
    setType("")
    setDate("")
    setValue("")
    setCategory("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-2'>
        <DialogHeader>
          <DialogTitle>
            Nova transação
          </DialogTitle>

          <DialogDescription>
            Registre sua despesa ou receita
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <Label htmlFor="description">
              Descrição
            </Label>
            <Input 
              id="title"
              placeholder="Ex. Almoço no restaurante"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              disabled={loading}
            >
            </Input>
          </div>

          <div className="flex flex-row justify-between">
            <div>
              <Label htmlFor="date">
                Data
              </Label>
              <Input 
                id="date"
                placeholder="Selecione"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
                disabled={loading}
              >
              </Input>
            </div>

            <div>
              <Label htmlFor="value">
                Valor
              </Label>
              <Input 
                id="value"
                placeholder="R$ 0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
                disabled={loading}
              >
              </Input>
            </div>
          </div>

          <div>
            <Label htmlFor="category">
              Categoria
            </Label>
            <Input 
              id="category"
              placeholder="Selecione"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full"
              disabled={loading}
            >
            </Input>
          </div>

          <div>
            <Button type="submit" disabled={loading}>
              Salvar
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  )
}