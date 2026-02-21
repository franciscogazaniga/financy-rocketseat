import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ICON_REGISTRY } from "@/lib/icons-registry"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS } from "@/lib/colors-registry"
import { useForm } from "react-hook-form"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Category"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormState = {
  title: string
  description: string
  icon: string
  color: string
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
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

  const [ createCategory, { loading } ] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [LIST_CATEGORIES],
    onCompleted() {
      toast.success("Categoria criada com sucesso!")
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
    createCategory({
      variables: {
        data: {
          ...data,
        }
      }
    })
  })

  useEffect(() => {
    if(open) reset()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='space-y-2'>
        <DialogHeader>
          <DialogTitle>
            Nova categoria
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
              disabled={loading}
              required
              className={cn(
                "w-full text-title-primary",
              )}
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