import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Paperclip, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Screen, ScreenHeader } from "@/components/poppy/Screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatKz, jobs } from "@/lib/poppy-data";

export const Route = createFileRoute("/jobs/$jobId/proposal")({
  loader: ({ params }) => {
    const job = jobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `Enviar proposta — ${loaderData.job.title} | Poppy` },
            { name: "description", content: "Defina valor, prazo, mensagem e portfólio para enviar a sua proposta." },
            { property: "og:title", content: "Enviar proposta — Poppy" },
            { property: "og:description", content: "Valor, prazo, mensagem e portfólio numa proposta clara." },
          ],
        }
      : { meta: [{ title: "Proposta indisponível — Poppy" }, { name: "robots", content: "noindex" }] },
  component: ProposalPage,
});

function ProposalPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();
  const [value, setValue] = useState(String(job.budget));
  const [days, setDays] = useState("14");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<string[]>(["portfolio-2026.pdf"]);

  const numeric = Number(value) || 0;
  const fee = Math.round(numeric * 0.1);

  return (
    <Screen>
      <ScreenHeader title="Enviar proposta" subtitle={job.title} back="/jobs" />

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Proposta enviada", { description: `${job.client} receberá a sua proposta agora.` });
          navigate({ to: "/projects" });
        }}
      >
        <div>
          <Label htmlFor="value">Valor da proposta (Kz)</Label>
          <Input
            id="value"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            className="mt-2 rounded-xl"
            required
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Taxa Poppy 10%: {formatKz(fee)} · você recebe {formatKz(numeric - fee)}
          </p>
        </div>

        <div>
          <Label htmlFor="days">Prazo de entrega (dias)</Label>
          <Input
            id="days"
            inputMode="numeric"
            value={days}
            onChange={(e) => setDays(e.target.value.replace(/\D/g, ""))}
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="message">Mensagem para o cliente</Label>
            <button
              type="button"
              onClick={() =>
                setMessage(
                  `Olá! Trabalho há 6 anos com ${job.skills[0]} e já entreguei projetos semelhantes ao "${job.title}". Proponho começar com um plano em 3 etapas, com revisões incluídas e entrega em ${days} dias.`,
                )
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <Sparkles className="size-3.5" /> Melhorar com Poppy AI
            </button>
          </div>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Explique como vai resolver o problema do cliente."
            className="mt-2 rounded-xl"
            required
          />
        </div>

        <div>
          <Label>Arquivos e portfólio</Label>
          <div className="mt-2 space-y-2">
            {files.map((f) => (
              <div key={f} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm">
                <Paperclip className="size-4 text-muted-foreground" />
                <span className="flex-1 truncate">{f}</span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((x) => x !== f))}
                  className="text-xs font-semibold text-destructive"
                >
                  Remover
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setFiles([...files, `anexo-${files.length + 1}.png`])}
            >
              <Paperclip className="size-4" /> Anexar arquivo
            </Button>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full rounded-xl">
          Enviar proposta
        </Button>
      </form>
    </Screen>
  );
}
