import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  gradient: "bg-gradient-primary" | "bg-gradient-accent";
};

const slides: Slide[] = [
  {
    eyebrow: "Micro tarefas",
    title: "Ganhe ainda hoje",
    description: "Tarefas de poucos minutos, com pagamento direto na sua carteira Poppy.",
    cta: "Ver micro tarefas",
    to: "/jobs",
    gradient: "bg-gradient-primary",
  },
  {
    eyebrow: "Tem uma empresa?",
    title: "Publique uma tarefa",
    description: "Descreva o que precisa e comece a receber propostas em minutos.",
    cta: "Publicar tarefa",
    to: "/post",
    gradient: "bg-gradient-accent",
  },
  {
    eyebrow: "Mais confiança",
    title: "Verifique a sua identidade",
    description: "Contas verificadas desbloqueiam tarefas com valores mais altos.",
    cta: "Verificar agora",
    to: "/kyc",
    gradient: "bg-gradient-primary",
  },
];

export function PromoBanner() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (touch) touchStartX.current = touch.clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    if (touchStartX.current === null || !touch) return;
    const delta = touch.clientX - touchStartX.current;
    if (delta > 40) setIndex((i) => (i - 1 + slides.length) % slides.length);
    else if (delta < -40) setIndex((i) => (i + 1) % slides.length);
    touchStartX.current = null;
  }

  return (
    <section className="mt-4">
      <div
        className="shadow-float overflow-hidden rounded-3xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <Link
              key={slide.title}
              to={slide.to}
              className={`flex min-h-[152px] w-full shrink-0 flex-col justify-between p-5 text-primary-foreground ${slide.gradient}`}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide opacity-80">{slide.eyebrow}</p>
                <p className="font-display mt-1 text-xl font-bold leading-tight">{slide.title}</p>
                <p className="mt-1.5 text-xs text-primary-foreground/85">{slide.description}</p>
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                {slide.cta} <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-2.5 flex justify-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            aria-label={`Ver destaque ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
