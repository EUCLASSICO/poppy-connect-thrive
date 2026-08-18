import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries, createUser, isEmailTaken, isUsernameTaken, type Country } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Criar conta — Poppy" },
      { name: "description", content: "Crie a sua conta Poppy com Gmail, nome completo, país e nome de usuário." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<Country | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim() || !username.trim() || !email.trim() || !country || !password || !confirmPassword) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const emailNormalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(emailNormalized)) {
      toast.error("Use um endereço Gmail válido (ex.: nome@gmail.com).");
      return;
    }

    if (username.trim().length < 3) {
      toast.error("O nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (isEmailTaken(emailNormalized)) {
      toast.error("Já existe uma conta com este Gmail.");
      return;
    }

    if (isUsernameTaken(username.trim())) {
      toast.error("Este nome de usuário já está em uso.");
      return;
    }

    setLoading(true);
    const user = createUser({
      fullName: fullName.trim(),
      username: username.trim(),
      email: emailNormalized,
      country,
      password,
    });
    setLoading(false);

    toast.success("Conta criada com sucesso!", {
      description: `O seu ID Poppy é ${user.id}. Guarde-o para entrar mais tarde.`,
      duration: 6000,
    });
    navigate({ to: "/" });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <PoppyLogo size={48} />
        <h1 className="font-display mt-4 text-2xl font-bold tracking-tight">Criar conta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          O seu ID Poppy é gerado automaticamente após o cadastro.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            placeholder="Ex.: Maria da Silva"
            className="mt-2 rounded-xl"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <Label htmlFor="username">Nome de usuário</Label>
          <Input
            id="username"
            placeholder="Ex.: maria.silva"
            className="mt-2 rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div>
          <Label htmlFor="email">Gmail</Label>
          <Input
            id="email"
            type="email"
            placeholder="nome@gmail.com"
            className="mt-2 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <Label>País</Label>
          <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
            <SelectTrigger className="mt-2 w-full rounded-xl">
              <SelectValue placeholder="Selecionar país" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              className="rounded-xl pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

        <div>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Repita a senha"
            className="mt-2 rounded-xl"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" size="lg" className="w-full rounded-xl" disabled={loading}>
          {loading ? "A criar conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Entrar
        </Link>
      </p>
    </main>
  );
}
