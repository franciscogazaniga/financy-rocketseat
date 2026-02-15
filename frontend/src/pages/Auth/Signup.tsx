import { useState } from "react";
import logo from "@/assets/Logo.svg"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const signUp = useAuthStore((state) => state.signup)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const signUpMutate = await signUp({
        name,
        email,
        password
      })

      if(signUpMutate) {
        toast.success("Cadastro realizado com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao realizar o cadastro.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6">
      <img src={logo} className="w-[134px] h-8" />
      <Card className="flex flex-col w-full max-w-md gap-y-8">
        <CardHeader className="flex items-center pb-0">
          <CardTitle className="text-xl font-bold">
            Criar conta
          </CardTitle>
          <CardDescription className="text-base font-light">
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Nome completo</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>  

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>  

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>


            <Button type="submit" className="w-full" variant={"default"} disabled={loading}>
              Cadastrar
            </Button>
          </form>

          <div className="flex items-center justify-center gap-3 font-light text-sm">
            <span className="border-t-[1px] w-full border-gray-300 solid"/>
            <span>ou</span>
            <span className="border-t-[1px] w-full border-gray-300 solid"/>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 font-light text-sm">
            <span>Já tem uma conta?</span>

            <Button className="w-full" variant={"secondary"}>
              Fazer login
            </Button>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}