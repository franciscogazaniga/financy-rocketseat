import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { UPDATE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ICON_REGISTRY } from "@/lib/icons-registry"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS } from "@/lib/colors-registry"
import { useForm } from "react-hook-form"
import type { Category } from "@/types"
import { GET_CATEGORIES, LIST_CATEGORIES } from "@/lib/graphql/queries/Category"

interface UpdateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category
}

type FormState = {
  title: string
  description: string
  icon: string
  color: string
}

export function UpdateCategoryDialog({
  open,
  onOpenChange,
  category,
}: UpdateCategoryDialogProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormState>({
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      color: ""
    }
  })

  const iconEntries = Object.entries(ICON_REGISTRY)
  const colorEntries = Object.entries(CATEGORY_COLORS)

  const icon = watch("icon")
  const color = watch("color")

  const [ updateCategory, { loading } ] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [LIST_CATEGORIES, { query: GET_CATEGORIES }],
    onCompleted() {
      toast.success("Categoria atualizada com sucesso!")
      onOpenChange(false)
    },
    onError(error) {
      const err = error as any

      const graphQLError =
        err?.cause?.errors?.[0]?.message

      toast.error(graphQLError ?? error.message)
    }
  })

  const onSubmit = handleSubmit((data) => {
    updateCategory({
      variables: {
        id: category.id,
        data: {
          ...data,
        }
      }
    })
  })

  useEffect(() => {
    if (open && category) {
      reset({
        title: category.title,
        description: category.description,
        icon: category.icon,
        color: category.color,
      })
    }
  }, [open, category, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-2'>
        <DialogHeader>
          <DialogTitle>
            Atualizar categoria
          </DialogTitle>

          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">
              Título
            </Label>
            <Input 
              {...register("title")}
              placeholder="Ex. Alimentação"
              className="w-full text-title-primary"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Descrição
            </Label>
            <Input 
              {...register("description")}
              placeholder="Descrição da categoria"
              className="w-full text-title-primary"
              disabled={loading}
            />

            <span className="text-xs text-gray-500 font-light">Opcional</span>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="icon">
                Ícone
              </Label>
              <div className="grid grid-cols-8 gap-2 justify-center">
                {iconEntries.map(([iconSelected, Icon]) => (
                  <button
                    key={iconSelected}
                    type="button"
                    onClick={() => setValue("icon", iconSelected)}
                    className={cn(
                      "h-10 w-10 p-3 bg-white rounded-[8px] border hover:border-green-base hover:bg-gray-100",
                      icon === iconSelected && "border-brand-base"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <Label htmlFor="color">
                Cor
              </Label>
              <div className="grid grid-cols-7 gap-2 justify-center">
                {colorEntries.map(([colorSelected, bgColor]) => (
                  <button
                    key={colorSelected}
                    type="button"
                    onClick={() => setValue("color", colorSelected)}
                    className={cn(
                      "w-fit p-1 rounded-[8px] border hover:border-green-base",
                      color === colorSelected && "border-brand-base"
                    )}
                  >
                    <div className={`${bgColor.base} w-10 h-5 rounded-[4px]`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full">
            <Button className="w-full" type="submit" disabled={loading}>
              Salvar
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  )
}