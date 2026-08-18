import logo from "@/assets/poppy-logo.png";
import { cn } from "@/lib/utils";

export function PoppyLogo({
  size = 32,
  withText = false,
  className,
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <img src={logo} alt="Logotipo Poppy" width={size} height={size} style={{ width: size, height: size }} />
      {withText && <span className="font-display text-xl font-bold tracking-tight">Poppy</span>}
    </span>
  );
}
