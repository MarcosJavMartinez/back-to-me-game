"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, AtSign, KeyRound, Leaf, UserRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "login" | "signup" | "forgot" | "reset";

const content = {
  login: {
    eyebrow: "Que bueno verte de nuevo",
    title: "Continua tu camino",
    description: "Tu mundo, tu racha y tus pequenas victorias te estan esperando.",
    submit: "Ingresar"
  },
  signup: {
    eyebrow: "Empeza de a poquito",
    title: "Crea tu cuenta",
    description: "Guarda tu progreso y hace crecer un mundo que sea solo tuyo.",
    submit: "Crear cuenta"
  },
  forgot: {
    eyebrow: "No pasa nada",
    title: "Recupera tu cuenta",
    description: "Te enviaremos un enlace seguro para elegir una contrasena nueva.",
    submit: "Enviar enlace"
  },
  reset: {
    eyebrow: "Un ultimo paso",
    title: "Nueva contrasena",
    description: "Elegi una contrasena que puedas recordar y que sea dificil de adivinar.",
    submit: "Guardar contrasena"
  }
} as const;

function friendlyError(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login credentials")) return "El correo o la contrasena no coinciden.";
  if (normalized.includes("user already registered")) return "Ya existe una cuenta con ese correo.";
  if (normalized.includes("password should be")) return "La contrasena debe tener al menos 8 caracteres.";
  if (normalized.includes("email not confirmed")) return "Revisa tu correo y confirma la cuenta antes de ingresar.";
  if (normalized.includes("rate limit")) return "Hicimos demasiados intentos. Espera un momento y proba de nuevo.";
  return "No pudimos completar la accion. Revisa los datos e intenta otra vez.";
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const copy = content[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace("/");
        router.refresh();
        return;
      }

      if (mode === "signup") {
        const displayName = String(form.get("displayName") ?? "").trim();
        const confirmation = String(form.get("passwordConfirmation") ?? "");
        if (displayName.length < 2) {
          setError("Escribe un nombre de al menos 2 caracteres.");
          return;
        }
        if (password.length < 8) {
          setError("La contrasena debe tener al menos 8 caracteres.");
          return;
        }
        if (password !== confirmation) {
          setError("Las contrasenas no coinciden.");
          return;
        }
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName, onboarding_completed: false },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace("/");
          router.refresh();
        } else {
          setMessage("Cuenta creada. Revisa tu correo para confirmarla y luego ingresa.");
        }
        return;
      }

      if (mode === "forgot") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
        });
        if (authError) throw authError;
        setMessage("Listo. Si existe una cuenta con ese correo, recibiras un enlace para recuperarla.");
        return;
      }

      const confirmation = String(form.get("passwordConfirmation") ?? "");
      if (password.length < 8) {
        setError("La contrasena debe tener al menos 8 caracteres.");
        return;
      }
      if (password !== confirmation) {
        setError("Las contrasenas no coinciden.");
        return;
      }
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setMessage("Contrasena actualizada. Ya puedes continuar.");
      window.setTimeout(() => router.replace("/"), 900);
    } catch (authError) {
      setError(friendlyError(authError instanceof Error ? authError.message : ""));
    } finally {
      setLoading(false);
    }
  }

  const needsEmail = mode !== "reset";
  const needsPassword = mode !== "forgot";

  return (
    <main className="min-h-screen px-4 py-8 sm:grid sm:place-items-center">
      <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-line bg-cream/95 shadow-soft md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-skysoft p-10 md:block">
          <div className="absolute -left-10 bottom-16 h-44 w-72 rounded-[50%] bg-leaf/45" />
          <div className="absolute -right-20 bottom-4 h-56 w-96 rounded-[50%] bg-forest/25" />
          <div className="absolute right-12 top-20 h-16 w-40 rounded-[50%] bg-white/75" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-black text-forest shadow-soft">
              <Leaf size={20} /> Back to Me App
            </div>
            <h2 className="mt-10 max-w-sm text-4xl font-black leading-tight">Un pequeno paso hoy puede cambiar todo tu paisaje.</h2>
            <p className="mt-4 max-w-sm text-lg font-bold text-muted">Crea habitos sin castigos, gana recompensas y mira como crece tu propio mundo.</p>
          </div>
          <div className="absolute bottom-28 left-1/2 grid h-36 w-36 -translate-x-1/2 place-items-center rounded-full border-8 border-cream bg-leaf text-6xl shadow-soft">🌱</div>
        </div>

        <div className="p-6 sm:p-10 md:p-14">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 font-black text-forest md:hidden"><Leaf size={20} /> Back to Me App</Link>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-forest">{copy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{copy.title}</h1>
          <p className="mt-3 font-semibold text-muted">{copy.description}</p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            {mode === "signup" && (
              <label className="grid gap-2 text-sm font-black">
                Tu nombre
                <span className="flex items-center gap-2 rounded-2xl border border-line bg-white/70 px-4">
                  <UserRound size={19} className="text-forest" />
                  <input name="displayName" autoComplete="name" required minLength={2} placeholder="Como quieres que te llamemos" className="min-h-12 w-full border-0 bg-transparent outline-none" />
                </span>
              </label>
            )}

            {needsEmail && (
              <label className="grid gap-2 text-sm font-black">
                Correo
                <span className="flex items-center gap-2 rounded-2xl border border-line bg-white/70 px-4">
                  <AtSign size={19} className="text-forest" />
                  <input name="email" type="email" autoComplete="email" required placeholder="tu@correo.com" className="min-h-12 w-full border-0 bg-transparent outline-none" />
                </span>
              </label>
            )}

            {needsPassword && (
              <label className="grid gap-2 text-sm font-black">
                {mode === "reset" ? "Nueva contrasena" : "Contrasena"}
                <span className="flex items-center gap-2 rounded-2xl border border-line bg-white/70 px-4">
                  <KeyRound size={19} className="text-forest" />
                  <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} placeholder="Minimo 8 caracteres" className="min-h-12 w-full border-0 bg-transparent outline-none" />
                </span>
              </label>
            )}

            {(mode === "signup" || mode === "reset") && (
              <label className="grid gap-2 text-sm font-black">
                Repite la contrasena
                <span className="flex items-center gap-2 rounded-2xl border border-line bg-white/70 px-4">
                  <KeyRound size={19} className="text-forest" />
                  <input name="passwordConfirmation" type="password" autoComplete="new-password" required minLength={8} className="min-h-12 w-full border-0 bg-transparent outline-none" />
                </span>
              </label>
            )}

            {error && <div role="alert" className="rounded-2xl border border-coral/50 bg-coral/15 px-4 py-3 text-sm font-bold">{error}</div>}
            {message && <div role="status" className="rounded-2xl border border-leaf/50 bg-leaf/15 px-4 py-3 text-sm font-bold text-forest">{message}</div>}

            <button disabled={loading} className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-leaf px-5 py-4 font-black text-white shadow-soft disabled:opacity-60">
              {loading ? "Un momento..." : copy.submit} {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-bold text-muted">
            {mode === "login" && <><Link href="/forgot-password" className="text-forest hover:underline">Olvide mi contrasena</Link><p className="mt-5">¿Todavia no tienes cuenta? <Link href="/signup" className="text-forest hover:underline">Crear cuenta</Link></p></>}
            {mode === "signup" && <p>¿Ya tienes cuenta? <Link href="/login" className="text-forest hover:underline">Ingresar</Link></p>}
            {(mode === "forgot" || mode === "reset") && <Link href="/login" className="text-forest hover:underline">Volver al inicio de sesion</Link>}
          </div>
        </div>
      </section>
    </main>
  );
}
