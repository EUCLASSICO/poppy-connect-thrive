import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Screen, ScreenHeader } from "@/components/poppy/Screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/poppy-data";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Publicar trabalho — Poppy" },
      { name: "description", content: "Publique um trabalho no Poppy: título, categoria, orçamento, prazo e habilidades." },
      { property: "og:title", content: "Publicar trabalho — Poppy" },
      { property: "og:description", content: "Encontre profissionais certos publicando o seu trabalho em minutos." },
    ],
  }),
  component: PostJob,
});

function PostJob() {
  const navigate = useNavigate();
  const [remote, setRemote] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  return (
    <Screen>
      <ScreenHeader title="Publicar trabalho" subtitle="Poppy Business" back="/" />

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Trabalho publicado", { description: "Profissionais qualificados serão notificados." });
          navigate({ to: "/business" });
        }}
      >
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" placeholder="Ex.: Designer para redesenhar app" className="mt-2 rounded-xl" required />
        </div>

        <div>
          <Label>Categoria</Label>
          <Select required>
            <SelectTrigger className="mt-2 w-full rounded-xl">
              <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="desc">Descrição</Label>
          <Textarea
            id="desc"
            rows={5}
            placeholder="Explique o objetivo, entregáveis e contexto do trabalho."
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="budget">Orçamento (Kz)</Label>
            <Input id="budget" inputMode="numeric" placeholder="250000" className="mt-2 rounded-xl" required />
          </div>
          <div>
            <Label htmlFor="deadline">Prazo</Label>
            <Input id="deadline" placeholder="14 dias" className="mt-2 rounded-xl" required />
          </div>
        </div>

        <div>
          <Label htmlFor="skills">Habilidades</Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Ex.: Figma"
              className="rounded-xl"
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                if (skillInput.trim()) setSkills([...skills, skillInput.trim()]);
                setSkillInput("");
              }}
            >
              Adicionar
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <button
                  key={`${s}-${i}`}
                  type="button"
                  onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                >
                  {s} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-semibold">Trabalho remoto</p>
            <p className="text-xs text-muted-foreground">Desative para exigir presença no local.</p>
          </div>
          <Switch checked={remote} onCheckedChange={setRemote} />
        </div>

        {!remote && (
          <div>
            <Label htmlFor="loc">Localização</Label>
            <Input id="loc" placeholder="Luanda, Talatona" className="mt-2 rounded-xl" required />
          </div>
        )}

        <div>
          <Label htmlFor="workers">Número de trabalhadores necessários</Label>
          <Input id="workers" inputMode="numeric" defaultValue="1" className="mt-2 rounded-xl" required />
        </div>

        <Button type="submit" size="lg" className="w-full rounded-xl">
          Publicar trabalho
        </Button>
      </form>
    </Screen>
  );
}
