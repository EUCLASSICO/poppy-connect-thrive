import { createServerFn } from "@tanstack/react-start";

/** Entrar com ID Poppy ou nome de utilizador: o email é resolvido no servidor,
 *  por isso nunca é exposto a quem não souber a senha. */
export const signInWithIdentifier = createServerFn({ method: "POST" })
  .inputValidator((data: { identifier: string; password: string }) => data)
  .handler(async ({ data }) => {
    const identifier = data.identifier.trim();
    if (!identifier || !data.password) return { error: "invalid" as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: email } = await supabaseAdmin.rpc("resolve_login_email", { identifier });
    if (!email) return { error: "invalid" as const };

    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data: session, error } = await client.auth.signInWithPassword({
      email,
      password: data.password,
    });
    if (error || !session.session) return { error: "invalid" as const };

    return {
      accessToken: session.session.access_token,
      refreshToken: session.session.refresh_token,
    };
  });

/** Verifica se um Gmail ou nome de utilizador já está em uso, sem revelar dados de ninguém. */
export const checkIdentifierAvailable = createServerFn({ method: "POST" })
  .inputValidator((data: { kind: "email" | "username"; value: string }) => data)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: available } = await supabaseAdmin.rpc("identifier_available", {
      kind: data.kind,
      value: data.value.trim(),
    });
    return { available: available !== false };
  });
