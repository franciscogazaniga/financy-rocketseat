import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Category, Transaction } from "@/types"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { TRANSACTION_TYPE_CONFIG } from "@/lib/config/transaction-type.config"
import { useForm } from "react-hook-form"

interface UpdateTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction
}

type FormState = {
  description: string
  type: string
  date?: Date
  value: string
  categoryId: string
}

export function UpdateTransactionDialog({
  open,
  onOpenChange,
  transaction
}: UpdateTransactionDialogProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormState>({
    defaultValues: {
      description: "",
      value: "",
      type: "",
      date: undefined,
      categoryId: ""
    }
  })

  const formatCurrency = (value: string) => {
    const numeric = value.replace(/\D/g, "")

    const number = Number(numeric) / 100

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(number)
  }
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  const numeric = e.target.value.replace(/\D/g, "")

  setValue("value", numeric) // continua string
}

  const value = watch("value")
  const type = watch("type")
  const date = watch("date")
  const categoryId = watch("categoryId")

  const [ updateTransaction, { loading } ] = useMutation(UPDATE_TRANSACTION, {
    onCompleted() {
      toast.success("Transação atualizada com sucesso!")
      onOpenChange(false)
    },
    onError() {
      toast.error("Falha ao atualizar a transação.")
    }
  })

  const types = TRANSACTION_TYPE_CONFIG

  const { data } = useQuery<{ getCategories: Category[] }>(LIST_CATEGORIES)
  const categories = data?.getCategories ?? []

  const onSubmit = handleSubmit((data) => {
    if (!data.date) {
      toast.error("Selecione uma data")
      return
    }

    updateTransaction({
      variables: {
        id: transaction.id,
        data: {
          ...data,
          date: data.date.toISOString()
        }
      }
    })
  })

  useEffect(() => {
    if (open && transaction) {
      reset({
        description: transaction.description,
        type: transaction.type,
        date: new Date(transaction.date),
        value: transaction.value.toString(),
        categoryId: transaction.categoryId
      })
    }
  }, [open, transaction, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-2'>
        <DialogHeader>
          <DialogTitle>
            Atualizar transação
          </DialogTitle>

          <DialogDescription>
            Registre sua despesa ou receita
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-6">
          <div className="flex flex-row bg-white border border-border rounded-[8px] p-2">
            <button 
              type="button"
              className={`
                text-sm w-full flex flex-row items-center justify-center gap-3
                text-title-primary py-2 border rounded-[8px]
                ${type === "EXPENSE"
                  ? "border-red-base bg-gray-100 hover:border-red-base"
                  : "border-transparent bg-white hover:border-border"}
              `}
              onClick={() => setValue("type", types.EXPENSE.name, { shouldDirty: true })}
            >
              <ArrowDownCircle className={`${type === "EXPENSE" ? "text-red-base" : "text-foreground"} h-4 w-4`}/>
              <span>
                Despesa
              </span>
            </button>
            <button
              type="button"
              className={`
                text-sm w-full flex flex-row items-center justify-center gap-3
                text-title-primary py-2 border rounded-[8px]
                ${type === "INCOME"
                  ? "border-green-base bg-gray-100 hover:border-green-base"
                  : "border-transparent bg-white hover:border-border"}
              `}
              onClick={() => setValue("type", types.INCOME.name, { shouldDirty: true })}
            >
              <ArrowUpCircle className={`${type === "INCOME" ? "text-green-base" : "text-foreground"} h-4 w-4`}/> 
              <span>
                Receita
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Descrição
            </Label>
            <Input 
              {...register("description")}
              id="description"
              placeholder="Ex. Almoço no restaurante"
              className="w-full"
              disabled={loading}
            />
          </div>

          <div className="flex flex-row w-full gap-4 justify-between">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="date">
                Data
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-start py-3">
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={
                      (day) => setValue("date", day)
                    }
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-2 w-full text-title-primary">
              <Label htmlFor="value">
                Valor
              </Label>
              <Input 
                value={formatCurrency(value)}
                onChange={handleValueChange}
                id="value"
                placeholder="R$ 0,00"
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category">
              Categoria
            </Label>
            <Select value={categoryId} onValueChange={(value) => setValue("categoryId", value)}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button className="w-full" type="submit" disabled={loading}>
              Salvar
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  )
}