"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Sparkles } from "lucide-react";
import { CharacterCreator } from "@/components/CharacterCreator";
import { initialState } from "@/lib/storage";
import type { Avatar } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState<Avatar>(initialState.avatar);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      const name = String(user?.user_metadata.display_name || user?.email?.split("@")[0] || "Aventurero");
      setAvatar((current) => ({ ...current, name }));
    });
  }, []);

  async function finishOnboarding(name: string, appearance: Avatar["appearance"]) {
    setSaving(true);
    setError("");
    const cleanName = name.trim();
    const nextAvatar: Avatar = { ...avatar, name: cleanName, appearance };
    const state = {
      ...initialState,
      avatar: nextAvatar
    };

    try {
      const profileResponse = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          appearance,
          equippedItems: {},
          onboardingCompleted: true
        })
      });
      if (!profileResponse.ok) throw new Error("No pudimos guardar tu personaje.");

      const stateResponse = await fetch("/api/state", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ state, expectedUpdatedAt: null, force: true })
      });
      if (!stateResponse.ok) throw new Error("No pudimos preparar tu aventura.");

      await createClient().auth.updateUser({
        data: { display_name: cleanName, onboarding_completed: true }
      });
      router.replace("/");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No pudimos completar este paso.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-black text-forest shadow-soft"><Leaf size={20} /> Back to Me App</div>
          <div className="rounded-full bg-leaf/20 px-4 py-2 text-sm font-black text-forest">Paso 1 de 1</div>
        </div>
        <section className="soft-card rounded-[32px] p-4 sm:p-8">
          <div className="mx-auto mb-6 max-w-2xl text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sun/30 text-forest"><Sparkles size={28} /></div>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">Creá a quien va a recorrer este mundo</h1>
            <p className="mt-2 text-base font-bold text-muted sm:text-lg">Elegí su nombre y apariencia antes de comenzar. Después vas a poder desbloquear ropa, mascotas y accesorios.</p>
          </div>
          <CharacterCreator avatar={avatar} onSave={finishOnboarding} submitLabel={saving ? "Preparando tu mundo..." : "Empezar mi aventura"} disabled={saving} />
          {error && <div role="alert" className="mx-auto mt-4 max-w-xl rounded-2xl border border-coral/50 bg-coral/15 px-4 py-3 text-center font-bold">{error}</div>}
        </section>
      </div>
    </main>
  );
}
