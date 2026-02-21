import { useState } from "react";
import logo from "@/assets/Logo.svg"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { Eye, EyeClosed, Lock, LogIn, Mail, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailInputIsFocused, setEmailInputIsFocused] = useState(false)
  const [passwordInputIsFocused, setPasswordInputIsFocused] = useState(false)
  const [nameInputIsFocused, setNameInputIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  console.log(showPassword)

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
      const err = error as any

      const graphQLError =
        err?.cause?.errors?.[0]?.message

      toast.error(graphQLError ?? err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    if(showPassword) {
      setShowPassword(false)
    } else{
      setShowPassword(true)
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
                <Label htmlFor="name" className={cn(
                    nameInputIsFocused && "text-brand-base",
                    !!name && !nameInputIsFocused && "text-title-primary",
                    !name && !nameInputIsFocused && "text-gray-400"
                )}>
                  Nome completo
                </Label>
                <div className="relative flex-1">
                  <UserRound className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    nameInputIsFocused && "text-brand-base",
                    !!name && !nameInputIsFocused && "text-title-primary",
                    !name && !nameInputIsFocused && "text-gray-400"
                  )}/>
                  <Input
                      id="name"
                      type="name"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setNameInputIsFocused(true)}
                      onBlur={() => setNameInputIsFocused(false)}
                      required
                      className={cn(
                      "pl-9",
                      nameInputIsFocused && "text-title-primary",
                      !!name && !nameInputIsFocused && "text-title-primary",
                      !name && !nameInputIsFocused && "text-gray-400"
                    )}
                    />
                </div>
              </div>  

              <div className="space-y-2">
                <Label htmlFor="email"
                  className={cn(
                      emailInputIsFocused && "text-brand-base",
                      !!email && !emailInputIsFocused && "text-title-primary",
                      !email && !emailInputIsFocused && "text-gray-400"
                )}>
                  E-mail
                </Label>
                <div className="relative flex-1">
                  <Mail className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    emailInputIsFocused && "text-brand-base",
                    !!email && !emailInputIsFocused && "text-title-primary",
                    !email && !emailInputIsFocused && "text-gray-400"
                  )}/>
                  <Input
                      id="email"
                      type="email"
                      placeholder="mail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailInputIsFocused(true)}
                      onBlur={() => setEmailInputIsFocused(false)}
                      required
                      className={cn(
                      "pl-9",
                      emailInputIsFocused && "text-title-primary",
                      !!email && !emailInputIsFocused && "text-title-primary",
                      !email && !emailInputIsFocused && "text-gray-400"
                    )}
                    />
                </div>
              </div>  

              <div className="space-y-2">
                <Label htmlFor="password"
                  className={cn(
                      passwordInputIsFocused && "text-brand-base",
                      !!password && !passwordInputIsFocused && "text-title-primary",
                      !password && !passwordInputIsFocused && "text-gray-400"
                    )}
                >
                  Senha
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="relative flex-1">
                    <Lock className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      passwordInputIsFocused && "text-brand-base",
                      !!password && !passwordInputIsFocused && "text-title-primary",
                      !password && !passwordInputIsFocused && "text-gray-400"
                    )}/>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordInputIsFocused(true)}
                      onBlur={() => setPasswordInputIsFocused(false)}
                      required
                      className={cn(
                      "pl-9",
                      passwordInputIsFocused && "text-title-primary",
                      !!password && !passwordInputIsFocused && "text-title-primary",
                      !password && !passwordInputIsFocused && "text-gray-400"
                    )}
                    />
                    <Button 
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors text-title-primary",
                      )}
                      onClick={() => toggleShowPassword()}
                      >
                      {
                        showPassword ?
                        <Eye className="h-4 w-4"/>
                        :
                        <EyeClosed className="h-4 w-4"/>
                      }

                    </Button>
                  </div>
                  <span className="text-xs text-foreground font-light">A senha deve ter no mínimo 8 caracteres</span>
                </div>

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

            <div className="w-full">
              <Link to={"/login"}>
                <Button className="w-full gap-2" variant={"secondary"}>
                  <LogIn className="h-4 w-4" /> Fazer login
                </Button>
              </Link>
            </div>
          </div>


        </CardContent>
      </Card>
    </div>
  )
}