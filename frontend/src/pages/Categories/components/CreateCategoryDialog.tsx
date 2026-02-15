import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ICON_REGISTRY } from "@/lib/icons-registry"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS } from "@/lib/colors-registry"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
}: CreateCategoryDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")

  const iconEntries = Object.entries(ICON_REGISTRY)
  const colorEntries = Object.entries(CATEGORY_COLORS)

  const [ createCategory, { loading } ] = useMutation(CREATE_CATEGORY, {
    onCompleted() {
      toast.success("Categoria criada com sucesso!")
      onOpenChange(false)
    },
    onError() {
      toast.error("Falha ao criar a categoria.")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    createCategory({
      variables: {
        data: {
          title,
          description,
          icon,
          color,
        }
      }
    })
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setColor("")
    setIcon("")
    onOpenChange(false)
  }

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

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <Label htmlFor="title">
              Título
            </Label>
            <Input 
              id="title"
              placeholder="Ex. Alimentação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              disabled={loading}
            >
            </Input>
          </div>

          <div>
            <Label htmlFor="description">
              Descrição
            </Label>
            <Input 
              id="description"
              placeholder="Descrição da categoria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              disabled={loading}
            >
            </Input>
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
                    onClick={() => setIcon(iconSelected)}
                    className={cn(
                      "h-10 w-10 p-3 rounded-[8px] border hover:border-green-base",
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
                    onClick={() => setColor(colorSelected)}
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