import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Poppy" },
      { name: "description", content: "Entre na sua conta Poppy com o seu ID ou Gmail." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [idOrEmail, setIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!idOrEmail.trim() || !password) {
      toast.error("Preencha o ID (ou Gmail) e a senha.");
      return;
    }

    setLoading(true);
    const user = login(idOrEmail, password);
    setLoading(false);

    if (!user) {
      toast.error("ID/Gmail ou senha incorretos.");
      return;
    }

    toast.success(`Bem-vindo de volta, ${user.fullName.split(" ")[0]}!`);
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <PoppyLogo size={48} />
        <h1 className="font-display mt-4 text-2xl font-bold tracking-tight">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Use o seu ID Poppy ou Gmail para continuar.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="idOrEmail">ID ou Gmail</Label>
          <Input
            id="idOrEmail"
            placeholder="POP-123456 ou nome@gmail.com"
            className="mt-2 rounded-xl"
            value={idOrEmail}
            onChange={(e) => setIdOrEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="rounded-xl pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-xl" disabled={loading}>
          {loading ? "A entrar..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link to="/signup" className="font-semibold text-primary">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
