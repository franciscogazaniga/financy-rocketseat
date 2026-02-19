import logo from "@/assets/Logo.svg"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_USER } from "@/lib/graphql/queries/User";
import type { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UPDATE_USER } from "@/lib/graphql/mutations/User";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { getInitials } from "@/utils/getInitials";

type FormState = {
  name: string
}

export function Account() {
  const { register, handleSubmit } = useForm<FormState>({
    defaultValues: {
      name: "",
    }
  })

  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const userId = useAuthStore((state) => state.user?.id)

  const { data } = useQuery<{ getUser: User }>(GET_USER, {
    variables: {
      userId
    }
  })

  const user = data?.getUser
  const setUser = useAuthStore(state => state.setUser)

  const [ updateUser, { loading } ] = useMutation<
    { updateUser: User }
  >(UPDATE_USER, {
    onCompleted(data) {
      toast.success("Usuário atualizado com sucesso!")

      setUser(data.updateUser)
    },
    onError() {
      toast.error("Falha ao atualizar usuário.")
    }
  })

  const onSubmit = handleSubmit((data) => {
    updateUser({
      variables: {
        data: {
          ...data,
        }
      }
    })
  })

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6">
      <img src={logo} className="w-[134px] h-8" />
      <Card className="flex flex-col w-full max-w-md gap-y-8">
        <CardHeader className="flex items-center gap-6 pb-8 mx-8 border-b">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gray-300 text-2xl text-title-primary">
              {getInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <CardTitle className="text-xl font-bold">
              {user?.name}
            </CardTitle>
            <CardDescription className="text-base font-light">
              {user?.email}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Nome completo</Label>
                <Input
                  {...register("name")}
                  placeholder="Seu nome completo"
                  disabled={loading}
                />
              </div>  

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder={user?.email}
                    disabled={true}
                  />
                  <span className="text-xs text-foreground">
                    O e-mail não pode ser alterado
                  </span>
                </div>
              </div>  
            </div>


            <Button type="submit" className="w-full" variant={"default"} disabled={loading}>
              Salvar alterações
            </Button>
            <Button className="w-full" variant={"secondary"} disabled={loading} onClick={handleLogout}>
              <LogOut className="w-4 h-4 text-danger"/> Sair da conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}