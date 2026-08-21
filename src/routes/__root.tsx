import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BottomNav } from "@/components/poppy/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { PoppyLogo } from "@/components/poppy/PoppyLogo";
import { getCurrentUser } from "@/lib/auth";

const HIDE_NAV = ["/welcome", "/login", "/signup", "/messages/support"];
// Quem não tem sessão só pode ver as boas-vindas, login e cadastro — tudo o resto exige conta.
const PUBLIC_ROUTES = ["/welcome", "/login", "/signup"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta página não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Esta página não carregou</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo falhou do nosso lado. Tente atualizar ou voltar ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Poppy — Trabalho e freelancing" },
      {
        name: "description",
        content: "Poppy conecta trabalhadores, freelancers e empresas: encontre trabalhos, envie propostas e receba pagamentos.",
      },
      { name: "author", content: "Poppy" },
      { property: "og:title", content: "Poppy — Trabalho e freelancing" },
      { property: "og:description", content: "Encontre trabalhos, envie propostas e receba pagamentos com o Poppy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,600&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showNav = !HIDE_NAV.some((p) => pathname.startsWith(p));
  const isPublicRoute = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));

  // A sessão vive no localStorage (só existe no browser), por isso a
  // verificação corre depois de montar — no servidor e no primeiro
  // render do cliente mostramos sempre o mesmo estado "a verificar",
  // para não haver flash de conteúdo nem erro de hidratação.
  const [authState, setAuthState] = useState<"checking" | "authorized">(
    isPublicRoute ? "authorized" : "checking",
  );

  useEffect(() => {
    if (isPublicRoute) {
      setAuthState("authorized");
      return;
    }
    if (getCurrentUser()) {
      setAuthState("authorized");
    } else {
      router.navigate({ to: "/welcome", replace: true });
    }
  }, [pathname, isPublicRoute]);

  return (
    <QueryClientProvider client={queryClient}>
      {authState === "authorized" ? (
        <>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          {showNav && <BottomNav />}
        </>
      ) : (
        <AuthCheckingScreen />
      )}
      <Toaster />
    </QueryClientProvider>
  );
}

function AuthCheckingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4">
      <PoppyLogo size={34} className="animate-poppy-breathe" />
      <div className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-poppy-loading-bar rounded-full bg-primary" />
      </div>
    </div>
  );
}
