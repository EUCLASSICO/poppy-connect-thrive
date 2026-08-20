import { cn } from "@/lib/utils";

/**
 * Taxa de sucesso — reputação do trabalhador, mostrada como um anel circular.
 * Sobe quando uma tarefa é aprovada. Desce quando uma tarefa não é aprovada
 * ou quando há muitas tarefas acumuladas por confirmar. Abaixo de 50% a
 * conta fica temporariamente impedida de aceitar novas tarefas.
 */
export function SuccessRateRing({ value, size = 64 }: { value: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  const tone =
    clamped <= 50 ? "text-destructive" : clamped < 80 ? "text-warning" : "text-primary";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-500", tone)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-display text-sm font-bold", tone)}>{Math.round(clamped)}%</span>
      </div>
    </div>
  );
}
