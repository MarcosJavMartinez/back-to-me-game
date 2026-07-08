import type { Avatar } from "@/lib/types";
import { defaultAppearance } from "@/lib/avatar";

type CharacterPreviewProps = {
  small?: boolean;
  compact?: boolean;
  equippedItems?: Avatar["equippedItems"];
  appearance?: Avatar["appearance"];
};

export function CharacterPreview({ small = false, compact = false, equippedItems = {}, appearance: providedAppearance }: CharacterPreviewProps) {
  const appearance = { ...defaultAppearance, ...providedAppearance };
  const head = equippedItems.head;
  const body = equippedItems.body;
  const accessory = equippedItems.accessory;
  const backpack = equippedItems.backpack;
  const weapon = equippedItems.weapon;
  const pet = equippedItems.pet;
  const background = equippedItems.background;
  const height = Math.max(0, Math.min(100, appearance.height));
  const bodyBuild = Math.max(0, Math.min(100, appearance.bodyBuild));
  const muscularity = Math.max(0, Math.min(100, appearance.muscularity));
  const torsoWidth = 48 + bodyBuild * 0.28 + muscularity * 0.12;
  const torsoHeight = 58 + height * 0.16;
  const torsoTop = 116;
  const legHeight = 28 + height * 0.18;
  const legTop = torsoTop + torsoHeight - 3;
  const armWidth = 14 + muscularity * 0.08;
  const armHeight = 48 + height * 0.08;
  const torsoRadius = appearance.gender === "woman" ? "38% 38% 24% 24%" : appearance.gender === "man" ? "18px 18px 12px 12px" : "28px 28px 18px 18px";
  const outfitColors: Record<string, string> = {
    "capa-papel": "#F4E7CF",
    "armadura-carton": "#C99B5B",
    "capa-paja": "#E8C873",
    "capa-musgo": "#71945B",
    "traje-comfy": "#78C7E8",
    "capa-chapa": "#9BAAB2",
    "capa-estrella": "#A78BFA",
    "capa-rubi": "#C95667",
    "buso-capucha": "#4B8FC0"
  };
  const outfitColor = body ? outfitColors[body] ?? appearance.shirtColor : appearance.shirtColor;

  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl ${compact ? "h-20 w-20" : small ? "mx-auto h-40 w-40" : "mx-auto h-64 w-64"}`} aria-label="Avatar caricaturesco">
      <div className={`relative h-64 w-64 origin-top-left ${compact ? "scale-[0.3125]" : small ? "scale-[0.625]" : ""}`}>
      {background === "fondo-bosque" && (
        <>
          <div className="absolute inset-0 bg-[#CDECC9]" />
          <div className="absolute left-4 top-10 h-28 w-10 rounded-t-full bg-forest/70" />
          <div className="absolute right-6 top-8 h-32 w-12 rounded-t-full bg-leaf" />
          <div className="absolute right-14 top-14 h-24 w-9 rounded-t-full bg-forest/50" />
        </>
      )}
      {background === "fondo-playa" && (
        <>
          <div className="absolute inset-0 bg-watersoft/45" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-[#F8DFA1]" />
          <div className="absolute left-0 top-20 h-8 w-full rounded-[50%] bg-white/60" />
        </>
      )}
      {background === "fondo-campo" && (
        <>
          <div className="absolute inset-0 bg-[#DDF0CF]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[#AFCB79]" />
          <div className="absolute left-5 top-8 h-10 w-10 rounded-full bg-sun/80" />
          <div className="absolute bottom-16 left-5 h-12 w-2 rounded-full bg-[#D8B45B]" />
          <div className="absolute bottom-16 right-8 h-16 w-2 rounded-full bg-[#D8B45B]" />
        </>
      )}
      {background === "fondo-taller" && (
        <>
          <div className="absolute inset-0 bg-[#D8C7B0]" />
          <div className="absolute inset-x-3 bottom-3 h-14 rounded-xl border-2 border-ink/40 bg-[#A8784F]" />
          <div className="absolute left-6 top-8 h-4 w-20 rounded bg-[#B7C6CE]" />
          <div className="absolute right-7 top-12 h-12 w-4 rotate-12 rounded bg-[#7B8B93]" />
        </>
      )}
      {background === "fondo-sol" && (
        <>
          <div className="absolute inset-0 bg-[#FFE9A8]" />
          <div className="absolute left-1/2 top-5 h-28 w-28 -translate-x-1/2 rounded-full bg-sun/70 shadow-[0_0_34px_rgba(247,201,72,0.8)]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-orangeSoft/70" />
        </>
      )}
      {!background && <div className="absolute inset-0 bg-skysoft/60" />}
      <div className="absolute inset-x-2 bottom-2 h-16 rounded-[50%] bg-leaf/35" />
      {body === "buso-capucha" && (
        <div className="absolute left-1/2 top-7 h-28 w-28 -translate-x-1/2 rounded-full border-2 border-ink bg-[#6BA7D6]" />
      )}
      <div className="absolute left-1/2 top-8 h-24 w-24 -translate-x-1/2 rounded-full border-2 border-ink" style={{ backgroundColor: appearance.skinTone }} />
      {appearance.hairStyle === "short" && <div className="absolute left-1/2 top-8 h-10 w-[5.75rem] -translate-x-1/2 rounded-t-full border-x-2 border-t-2 border-ink" style={{ backgroundColor: appearance.hairColor }} />}
      {appearance.hairStyle === "curly" && (
        <div className="absolute left-1/2 top-7 flex w-[5.8rem] -translate-x-1/2 justify-center">
          {[-1, 0, 1].map((position) => <span key={position} className="-mx-1 h-9 w-9 rounded-full border border-ink" style={{ backgroundColor: appearance.hairColor }} />)}
        </div>
      )}
      {appearance.hairStyle === "long" && <div className="absolute left-1/2 top-8 h-[6.3rem] w-[6rem] -translate-x-1/2 rounded-t-full border border-ink" style={{ backgroundColor: appearance.hairColor }} />}
      {appearance.hairStyle === "long" && <div className="absolute left-1/2 top-11 h-[5.1rem] w-[4.9rem] -translate-x-1/2 rounded-full" style={{ backgroundColor: appearance.skinTone }} />}
      {appearance.hairStyle === "ponytail" && (
        <>
          <div className="absolute right-[26%] top-10 h-14 w-10 rounded-full border-2 border-ink" style={{ backgroundColor: appearance.hairColor }} />
          <div className="absolute left-1/2 top-8 h-10 w-[5.75rem] -translate-x-1/2 rounded-t-full border-x-2 border-t-2 border-ink" style={{ backgroundColor: appearance.hairColor }} />
        </>
      )}
      {appearance.hairStyle === "mohawk" && (
        <>
          <div className="absolute left-1/2 top-8 h-10 w-[5.75rem] -translate-x-1/2 rounded-t-full border-x-2 border-t-2 border-ink" style={{ backgroundColor: appearance.hairColor }} />
          <div className="absolute left-1/2 top-2 flex h-12 -translate-x-1/2 items-end">
            {[7, 10, 12, 10, 7].map((size, index) => <span key={index} className="w-3 rounded-t-full border border-ink" style={{ height: `${size * 3}px`, backgroundColor: appearance.hairColor }} />)}
          </div>
        </>
      )}
      {appearance.eyeStyle === "round" && <><div className="absolute left-[43%] top-[4.35rem] h-2 w-2 rounded-full bg-ink" /><div className="absolute left-[56%] top-[4.35rem] h-2 w-2 rounded-full bg-ink" /></>}
      {appearance.eyeStyle === "happy" && <><div className="absolute left-[42%] top-[4.3rem] h-3 w-4 rounded-t-full border-t-2 border-ink" /><div className="absolute right-[42%] top-[4.3rem] h-3 w-4 rounded-t-full border-t-2 border-ink" /></>}
      {appearance.eyeStyle === "sleepy" && <><div className="absolute left-[42%] top-[4.55rem] h-0.5 w-4 rounded-full bg-ink" /><div className="absolute right-[42%] top-[4.55rem] h-0.5 w-4 rounded-full bg-ink" /></>}
      {appearance.eyeStyle === "sparkle" && <><div className="absolute left-[41%] top-[3.9rem] text-lg font-black text-ink">✦</div><div className="absolute right-[41%] top-[3.9rem] text-lg font-black text-ink">✦</div></>}
      {appearance.facialHair === "stubble" && <div className="absolute left-1/2 top-[5.35rem] h-8 w-12 -translate-x-1/2 rounded-b-full opacity-35" style={{ backgroundColor: appearance.hairColor }} />}
      {appearance.facialHair === "mustache" && <div className="absolute left-1/2 top-[5.25rem] h-3 w-10 -translate-x-1/2 rounded-[50%_50%_70%_70%]" style={{ backgroundColor: appearance.hairColor }} />}
      {appearance.facialHair === "beard" && <div className="absolute left-1/2 top-[5.1rem] h-10 w-14 -translate-x-1/2 rounded-b-[45%] border-x border-b border-ink" style={{ backgroundColor: appearance.hairColor }} />}
      <div className="absolute left-1/2 top-[5.5rem] h-3 w-6 -translate-x-1/2 rounded-b-full border-b-2 border-ink" />
      {head === "gorro-hoja" && (
        <div className="absolute left-1/2 top-5 h-12 w-16 -translate-x-1/2 -rotate-6 rounded-[55%_55%_35%_35%] border-2 border-ink bg-leaf">
          <div className="absolute left-7 top-1 h-9 w-1 rotate-12 rounded-full bg-forest" />
        </div>
      )}
      {head === "gorro-papel" && (
        <div className="absolute left-1/2 top-3 h-12 w-24 -translate-x-1/2">
          <div className="absolute bottom-0 left-0 h-10 w-24 skew-x-[-8deg] border-2 border-ink bg-[#F4E7CF] [clip-path:polygon(0_100%,12%_8%,38%_55%,58%_0,88%_58%,100%_100%)]" />
          <div className="absolute bottom-1 left-2 h-2 w-20 rounded-full border border-ink bg-white/55" />
        </div>
      )}
      {head === "sombrero-paja" && (
        <>
          <div className="absolute left-1/2 top-8 h-6 w-28 -translate-x-1/2 rounded-[50%] border-2 border-ink bg-sun" />
          <div className="absolute left-1/2 top-2 h-12 w-20 -translate-x-1/2 rounded-t-full border-2 border-ink bg-[#F8DFA1]" />
        </>
      )}
      {head === "cuernos-diablito" && (
        <>
          <div className="absolute left-[34%] top-5 h-8 w-5 -rotate-12 rounded-t-full border-2 border-ink bg-coral" />
          <div className="absolute right-[34%] top-5 h-8 w-5 rotate-12 rounded-t-full border-2 border-ink bg-coral" />
        </>
      )}
      {head === "corona-angel" && (
        <div className="absolute left-1/2 top-2 h-8 w-20 -translate-x-1/2 rounded-[50%] border-2 border-sun bg-sun/20" />
      )}
      {head === "gorra-chapa" && (
        <>
          <div className="absolute left-1/2 top-5 h-10 w-24 -translate-x-1/2 rounded-t-[48px] border-2 border-ink bg-[#AEBCC3]" />
          <div className="absolute left-1/2 top-11 h-3 w-16 rounded-r-full border-2 border-ink bg-[#8799A2]" />
        </>
      )}
      {head === "casco-metal" && (
        <div className="absolute left-1/2 top-4 h-16 w-[6.4rem] -translate-x-1/2 rounded-t-full border-2 border-ink bg-[#B7C6CE]">
          <div className="absolute inset-x-2 bottom-0 h-3 rounded-full border-t-2 border-ink bg-[#8799A2]" />
          <div className="absolute left-1/2 top-1 h-12 w-1 -translate-x-1/2 bg-white/55" />
        </div>
      )}
      {head === "corona-oro" && (
        <div className="absolute left-1/2 top-3 h-14 w-24 -translate-x-1/2 border-2 border-ink bg-sun [clip-path:polygon(0_100%,0_40%,20%_68%,35%_5%,52%_62%,72%_0,82%_66%,100%_35%,100%_100%)]">
          <div className="absolute bottom-2 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-[#FFF1A8]" />
        </div>
      )}
      {(accessory === "alas-angel" || accessory === "alas-demonio") && (
        <>
          <div className={`absolute left-[17%] top-[7.4rem] h-20 w-16 -rotate-12 rounded-[70%_30%_70%_30%] border-2 border-ink ${accessory === "alas-angel" ? "bg-white/85" : "bg-violetSoft"}`} />
          <div className={`absolute right-[17%] top-[7.4rem] h-20 w-16 rotate-12 rounded-[30%_70%_30%_70%] border-2 border-ink ${accessory === "alas-angel" ? "bg-white/85" : "bg-violetSoft"}`} />
        </>
      )}
      {body === "capa-aventurero" && <div className="absolute left-[31%] top-[7.4rem] h-[6.6rem] w-[5.6rem] rounded-b-[32px] border-2 border-ink bg-orangeSoft" />}
      {body === "capa-estrella" && (
        <div className="absolute left-[30%] top-[7.4rem] h-[6.8rem] w-[5.8rem] rounded-b-[34px] border-2 border-ink bg-violetSoft">
          <div className="absolute right-3 top-8 text-sm text-sun">*</div>
        </div>
      )}
      {body && ["capa-papel", "capa-paja", "capa-musgo", "capa-chapa", "capa-rubi"].includes(body) && (
        <div
          className="absolute left-1/2 top-[7.25rem] h-[7rem] w-[6.5rem] -translate-x-1/2 rounded-b-[38px] border-2 border-ink"
          style={{ backgroundColor: outfitColors[body] }}
        >
          <div className="absolute left-1/2 top-2 h-2 w-12 -translate-x-1/2 rounded-full bg-white/35" />
          {body === "capa-musgo" && <><div className="absolute left-3 top-8 h-3 w-5 rounded-full bg-leaf" /><div className="absolute right-4 top-14 h-3 w-4 rounded-full bg-forest/60" /></>}
          {body === "capa-chapa" && <><div className="absolute left-3 top-8 h-2 w-2 rounded-full bg-[#657780]" /><div className="absolute right-3 top-8 h-2 w-2 rounded-full bg-[#657780]" /></>}
          {body === "capa-rubi" && <div className="absolute left-1/2 top-10 h-5 w-5 -translate-x-1/2 rotate-45 border border-ink bg-coral" />}
        </div>
      )}
      <div
        className="absolute left-1/2 border-2 border-ink"
        style={{ top: torsoTop, width: torsoWidth, height: torsoHeight, transform: "translateX(-50%)", borderRadius: torsoRadius, backgroundColor: outfitColor }}
      />
      {body === "armadura-carton" && <div className="absolute left-[39%] top-[8.2rem] h-8 w-12 rounded-lg border border-ink bg-[#DDB87A]" />}
      {body === "traje-comfy" && <div className="absolute left-1/2 top-[8.2rem] h-3 w-3 -translate-x-1/2 rounded-full border border-ink bg-white/70" />}
      {body === "capa-papel" && <div className="absolute left-1/2 top-[8rem] h-10 w-16 -translate-x-1/2 border border-ink/60 bg-white/25 [clip-path:polygon(0_0,100%_0,85%_100%,15%_100%)]" />}
      <div className="absolute rounded-full border-2 border-ink" style={{ left: `calc(50% - ${torsoWidth / 2 + armWidth * 0.72}px)`, top: torsoTop + 5, width: armWidth, height: armHeight, transform: "rotate(10deg)", backgroundColor: appearance.skinTone }} />
      <div className="absolute rounded-full border-2 border-ink" style={{ right: `calc(50% - ${torsoWidth / 2 + armWidth * 0.72}px)`, top: torsoTop + 5, width: armWidth, height: armHeight, transform: "rotate(-10deg)", backgroundColor: appearance.skinTone }} />
      <div className="absolute rounded-b-xl border-2 border-ink" style={{ left: `calc(50% - ${torsoWidth * 0.23}px)`, top: legTop, width: 23 + bodyBuild * 0.05, height: legHeight, transform: "translateX(-50%)", backgroundColor: appearance.pantsColor }} />
      <div className="absolute rounded-b-xl border-2 border-ink" style={{ left: `calc(50% + ${torsoWidth * 0.23}px)`, top: legTop, width: 23 + bodyBuild * 0.05, height: legHeight, transform: "translateX(-50%)", backgroundColor: appearance.pantsColor }} />
      {backpack === "mochila-simple" && <div className="absolute right-[24%] top-[7.4rem] h-20 w-9 rounded-xl border-2 border-ink bg-[#B98545]" />}
      {backpack === "mochila-papel" && (
        <div className="absolute right-[20%] top-[7.5rem] h-20 w-12 rounded-xl border-2 border-ink bg-[#EAD7B7]">
          <div className="absolute left-2 top-4 h-8 w-7 rounded border border-ink bg-white/30" />
        </div>
      )}
      {backpack === "mochila-metal" && (
        <div className="absolute right-[19%] top-[7.3rem] h-[5.4rem] w-14 rounded-xl border-2 border-ink bg-[#AEBCC3]">
          <div className="absolute inset-x-2 top-3 h-2 rounded-full bg-white/50" />
          <div className="absolute bottom-3 left-1/2 h-4 w-5 -translate-x-1/2 rounded border border-ink bg-[#778991]" />
        </div>
      )}
      {weapon === "espada-madera" && <div className="absolute left-[23%] top-[8rem] h-20 w-3 rotate-[-22deg] rounded-full border border-ink bg-[#B98545]" />}
      {weapon === "varita-madera" && (
        <div className="absolute left-[22%] top-[8rem] h-20 w-2 rotate-[-24deg] rounded-full border border-ink bg-[#8B5D34]">
          <div className="absolute -left-2 -top-4 h-6 w-6 rotate-45 border-2 border-ink bg-sun [clip-path:polygon(50%_0,63%_35%,100%_38%,70%_60%,80%_100%,50%_76%,20%_100%,30%_60%,0_38%,37%_35%)]" />
        </div>
      )}
      {accessory === "escudo-carton" && (
        <div className="absolute right-[18%] top-[8.2rem] h-20 w-14 rounded-b-[45%] border-2 border-ink bg-[#DDB87A]">
          <div className="absolute left-1/2 top-3 h-10 w-1 -translate-x-1/2 bg-[#9B6A3D]" />
        </div>
      )}
      {accessory === "auriculares-nube" && (
        <>
          <div className="absolute left-[32%] top-[4.2rem] h-8 w-4 rounded-full border-2 border-ink bg-watersoft" />
          <div className="absolute right-[32%] top-[4.2rem] h-8 w-4 rounded-full border-2 border-ink bg-watersoft" />
          <div className="absolute left-1/2 top-[3.2rem] h-10 w-16 -translate-x-1/2 rounded-t-full border-t-2 border-ink" />
        </>
      )}
      {(accessory === "headphones-pro" || accessory === "auriculares-calle") && (
        <>
          <div className={`absolute left-[31%] top-[4.1rem] h-9 w-5 rounded-full border-2 border-ink ${accessory === "headphones-pro" ? "bg-[#2F2F2F]" : "bg-coral"}`} />
          <div className={`absolute right-[31%] top-[4.1rem] h-9 w-5 rounded-full border-2 border-ink ${accessory === "headphones-pro" ? "bg-[#2F2F2F]" : "bg-coral"}`} />
          <div className="absolute left-1/2 top-[3rem] h-12 w-20 -translate-x-1/2 rounded-t-full border-t-4 border-ink" />
        </>
      )}
      {accessory === "tattoos-suaves" && (
        <>
          <div className="absolute left-[30%] top-[9.2rem] h-1.5 w-5 rotate-12 rounded-full bg-violetSoft" />
          <div className="absolute right-[29%] top-[9.1rem] h-1.5 w-5 -rotate-12 rounded-full bg-coral" />
        </>
      )}
      {accessory === "skate-suave" && (
        <div className="absolute bottom-4 left-1/2 h-4 w-28 -translate-x-1/2 rounded-full border-2 border-ink bg-orangeSoft">
          <div className="absolute left-4 top-3 h-3 w-3 rounded-full border border-ink bg-cream2" />
          <div className="absolute right-4 top-3 h-3 w-3 rounded-full border border-ink bg-cream2" />
        </div>
      )}
      {accessory === "patines-nube" && (
        <>
          <div className="absolute bottom-5 left-[38%] h-4 w-8 rounded-full border-2 border-ink bg-watersoft" />
          <div className="absolute bottom-5 right-[38%] h-4 w-8 rounded-full border-2 border-ink bg-watersoft" />
        </>
      )}
      {accessory === "botas-goma" && (
        <>
          <div className="absolute bottom-5 left-[34%] h-9 w-10 rounded-b-xl border-2 border-ink bg-[#E3B94D]" />
          <div className="absolute bottom-5 right-[34%] h-9 w-10 rounded-b-xl border-2 border-ink bg-[#E3B94D]" />
        </>
      )}
      {accessory === "amuleto-rubi" && (
        <>
          <div className="absolute left-1/2 top-[7.25rem] h-11 w-12 -translate-x-1/2 rounded-b-full border-x-2 border-ink" />
          <div className="absolute left-1/2 top-[9.15rem] h-5 w-5 -translate-x-1/2 rotate-45 border-2 border-ink bg-coral" />
        </>
      )}
      {backpack === "notebook-stickers" && (
        <div className="absolute right-[18%] top-[8.4rem] h-14 w-12 rounded-md border-2 border-ink bg-[#A7B7FF]">
          <div className="absolute left-2 top-2 h-2 w-2 rounded-full bg-sun" />
          <div className="absolute right-2 bottom-2 h-2 w-2 rounded-full bg-coral" />
        </div>
      )}
      {weapon === "pinturas-esteticas" && (
        <div className="absolute left-[18%] top-[8.5rem] h-16 w-5 rotate-[-18deg] rounded-full border-2 border-ink bg-violetSoft">
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-sun" />
        </div>
      )}
      {(pet === "mascota-bichito" || pet === "mascota-bichito-papel" || pet === "mascota-polillita") && (
        <div className={`absolute bottom-8 right-6 h-10 w-10 rounded-full border-2 border-ink ${pet === "mascota-polillita" ? "bg-violetSoft" : "bg-sun"}`}>
          <div className="absolute left-2 top-3 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute left-1/2 top-6 h-1.5 w-4 -translate-x-1/2 rounded-b-full border-b border-ink" />
          {pet === "mascota-polillita" && (
            <>
              <div className="absolute -left-3 top-2 h-5 w-5 rounded-full border border-ink bg-violetSoft/60" />
              <div className="absolute -right-3 top-2 h-5 w-5 rounded-full border border-ink bg-violetSoft/60" />
            </>
          )}
        </div>
      )}
      {pet === "mascota-cajita" && (
        <div className="absolute bottom-8 right-5 h-11 w-11 rounded-xl border-2 border-ink bg-[#DDB87A]">
          <div className="absolute left-2 top-3 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute left-1/2 top-7 h-1.5 w-4 -translate-x-1/2 rounded-b-full border-b border-ink" />
        </div>
      )}
      {pet === "mascota-caracol" && (
        <div className="absolute bottom-7 right-4 h-9 w-14 rounded-full border-2 border-ink bg-[#DDB87A]">
          <div className="absolute left-1 top-1 h-7 w-7 rounded-full border-2 border-ink bg-sun" />
          <div className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-ink" />
        </div>
      )}
      {pet === "mascota-brote" && (
        <div className="absolute bottom-7 right-5 h-14 w-10 rounded-b-full border-2 border-ink bg-leaf">
          <div className="absolute left-1/2 -top-4 h-8 w-8 -translate-x-1/2 rounded-[60%_0_60%_0] border-2 border-ink bg-leaf" />
          <div className="absolute left-2 top-5 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute right-2 top-5 h-1.5 w-1.5 rounded-full bg-ink" />
        </div>
      )}
      {pet === "mascota-slime" && (
        <div className="absolute bottom-7 right-4 h-12 w-14 rounded-[45%] border-2 border-ink bg-watersoft">
          <div className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute left-1/2 top-7 h-1.5 w-5 -translate-x-1/2 rounded-b-full border-b border-ink" />
        </div>
      )}
      {pet === "mascota-zorrito" && (
        <div className="absolute bottom-7 right-3 h-12 w-16 rounded-[45%] border-2 border-ink bg-orangeSoft">
          <div className="absolute -top-3 left-2 h-6 w-5 rotate-[-20deg] rounded-t-full border-2 border-ink bg-orangeSoft" />
          <div className="absolute -top-3 right-2 h-6 w-5 rotate-[20deg] rounded-t-full border-2 border-ink bg-orangeSoft" />
          <div className="absolute left-5 top-4 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute right-5 top-4 h-1.5 w-1.5 rounded-full bg-ink" />
        </div>
      )}
      {pet === "mascota-tortuga" && (
        <div className="absolute bottom-7 right-4 h-11 w-16 rounded-full border-2 border-ink bg-[#AFC16B]">
          <div className="absolute left-3 top-2 h-7 w-9 rounded-full border border-ink bg-[#7F9D55]" />
          <div className="absolute right-1 top-4 h-2 w-2 rounded-full bg-ink" />
        </div>
      )}
      {pet === "mascota-robotito" && (
        <div className="absolute bottom-7 right-4 h-14 w-12 rounded-xl border-2 border-ink bg-[#B7C6CE]">
          <div className="absolute left-3 top-4 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute right-3 top-4 h-1.5 w-1.5 rounded-full bg-ink" />
          <div className="absolute left-1/2 top-8 h-1.5 w-5 -translate-x-1/2 rounded-b-full border-b border-ink" />
          <div className="absolute left-1/2 -top-3 h-3 w-1 -translate-x-1/2 bg-ink" />
        </div>
      )}
      {pet === "mascota-ciervo-sol" && (
        <div className="absolute bottom-6 right-0 h-20 w-24 rounded-[45%] border-2 border-ink bg-sun/90">
          <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-ink" />
          <div className="absolute right-7 top-3 h-2 w-2 rounded-full bg-ink" />
          <div className="absolute -top-8 left-5 h-10 w-2 rotate-[-25deg] rounded-full bg-[#B98545]" />
          <div className="absolute -top-8 right-8 h-10 w-2 rotate-[25deg] rounded-full bg-[#B98545]" />
        </div>
      )}
      {pet === "mascota-rubi" && (
        <div className="absolute bottom-3 right-0 h-28 w-28 rounded-[45%] border-2 border-ink bg-coral/80">
          <div className="absolute -left-4 top-8 h-16 w-10 rounded-full border-2 border-ink bg-coral/50" />
          <div className="absolute left-8 top-8 h-2 w-2 rounded-full bg-ink" />
          <div className="absolute right-8 top-8 h-2 w-2 rounded-full bg-ink" />
          <div className="absolute left-1/2 top-14 h-2 w-7 -translate-x-1/2 rounded-b-full border-b-2 border-ink" />
        </div>
      )}
      {pet === "mascota-ballena-celeste" && (
        <div className="absolute bottom-5 right-0 h-20 w-32 rounded-[50%] border-2 border-ink bg-watersoft">
          <div className="absolute left-8 top-6 h-2 w-2 rounded-full bg-ink" />
          <div className="absolute right-3 top-3 h-12 w-8 rotate-12 rounded-full border-2 border-ink bg-watersoft" />
          <div className="absolute left-1/2 top-11 h-2 w-9 -translate-x-1/2 rounded-b-full border-b-2 border-ink" />
        </div>
      )}
      </div>
    </div>
  );
}
