import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type PromoSlide = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  to?: string;
  cta?: string;
};

const AUTOPLAY_MS = 4200;
const TRANSITION_MS = 480;

/**
 * Banner promocional pequeno com troca automática de slide, arrastável
 * (swipe) e com looping infinito e transição suave — sem saltos.
 */
export function PromoBanner({ slides, className }: { slides: PromoSlide[]; className?: string }) {
  const n = slides.length;
  const extended = n > 1 ? [slides[n - 1], ...slides, slides[0]] : slides;

  const [index, setIndex] = useState(n > 1 ? 1 : 0);
  const [withTransition, setWithTransition] = useState(true);
  const [dragX, setDragX] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const widthRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number, transition = true) => {
    setWithTransition(transition);
    setIndex(i);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Autoplay
  useEffect(() => {
    if (n <= 1) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, n]);

  function restartAutoplay() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (n > 1) timerRef.current = setInterval(next, AUTOPLAY_MS);
  }

  // Salto instantâneo (sem transição) quando chega a um clone, para o loop parecer infinito
  function handleTransitionEnd() {
    if (n <= 1) return;
    if (index === extended.length - 1) {
      setWithTransition(false);
      setIndex(1);
    } else if (index === 0) {
      setWithTransition(false);
      setIndex(n);
    }
  }

  // Reativa a transição no próximo frame depois de um salto instantâneo
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => setWithTransition(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (n <= 1) return;
    dragging.current = true;
    startX.current = e.clientX;
    widthRef.current = trackRef.current?.offsetWidth ?? 1;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setDragX(e.clientX - startX.current);
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    const threshold = widthRef.current * 0.18;
    if (dragX < -threshold) goTo(index + 1);
    else if (dragX > threshold) goTo(index - 1);
    setDragX(0);
    restartAutoplay();
  }

  const dragPercent = widthRef.current ? (dragX / widthRef.current) * 100 : 0;
  const activeDot = ((index - 1 + n) % n + n) % n;

  return (
    <section className={cn("relative overflow-hidden rounded-2xl select-none", className)}>
      <div
        ref={trackRef}
        className="flex touch-pan-y"
        style={{
          transform: `translateX(calc(${-index * 100}% + ${dragPercent}%))`,
          transition: withTransition ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)` : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {extended.map((slide, i) => (
          <PromoSlideCard key={`${slide.id}-${i}`} slide={slide} />
        ))}
      </div>

      {n > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <span
              key={slide.id}
              className={cn(
                "h-1.5 rounded-full bg-primary-foreground/45 transition-all duration-300",
                i === activeDot ? "w-[18px] bg-primary-foreground" : "w-1.5",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PromoSlideCard({ slide }: { slide: PromoSlide }) {
  const Icon = slide.icon;
  const content = (
    <div className="bg-gradient-primary flex h-28 w-full shrink-0 items-center gap-3.5 px-5 text-primary-foreground">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15">
        <Icon className="size-[22px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-bold leading-tight">{slide.title}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-primary-foreground/85">{slide.description}</p>
      </div>
    </div>
  );

  if (slide.to) {
    return (
      <Link to={slide.to} draggable={false} className="w-full shrink-0">
        {content}
      </Link>
    );
  }
  return <div className="w-full shrink-0">{content}</div>;
}
