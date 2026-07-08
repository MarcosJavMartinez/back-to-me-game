import type { ShopItem } from "@/lib/types";

export const shopItems: ShopItem[] = [
  { id: "gorro-papel", name: "Gorro de papel", type: "head", price: 30, emoji: "Papel", rarity: "common", material: "papel", unlockLevel: 1, description: "Simple, liviano y con ganas de empezar.", bonus: { creativity: 1 } },
  { id: "capa-papel", name: "Capa de papel", type: "body", price: 40, emoji: "Papel", rarity: "common", material: "papel", unlockLevel: 1, description: "Primer abrigo de aventura tranquila.", bonus: { joy: 1 } },
  { id: "mochila-papel", name: "Mochila de papel", type: "backpack", price: 45, emoji: "Papel", rarity: "common", material: "papel", unlockLevel: 1, description: "Guarda promesas pequenas.", bonus: { discipline: 1 } },
  { id: "mascota-bichito-papel", name: "Bichito de papel", type: "pet", price: 55, emoji: "Bichito", rarity: "common", material: "papel", unlockLevel: 1, description: "Chiquito, tranquilo y siempre cerca.", bonus: { social: 1, joy: 1 } },

  { id: "armadura-carton", name: "Armadura de carton", type: "body", price: 90, emoji: "Carton", rarity: "common", material: "carton", unlockLevel: 10, description: "Liviana, tierna y cero intimidante.", bonus: { health: 2, discipline: 2 } },
  { id: "escudo-carton", name: "Escudo de carton", type: "accessory", price: 80, emoji: "Carton", rarity: "common", material: "carton", unlockLevel: 10, description: "Para cuidar tu ritmo.", bonus: { discipline: 2 } },
  { id: "mascota-cajita", name: "Mascota cajita", type: "pet", price: 100, emoji: "Carton", rarity: "rare", material: "carton", unlockLevel: 10, description: "Una cajita companera.", bonus: { social: 1, joy: 2 } },
  { id: "mascota-caracol", name: "Caracolito paciente", type: "pet", price: 115, emoji: "Caracol", rarity: "common", material: "carton", unlockLevel: 10, description: "Va lento, pero va.", bonus: { discipline: 2, joy: 1 } },

  { id: "sombrero-paja", name: "Sombrero de paja", type: "head", price: 130, emoji: "Paja", rarity: "common", material: "paja", unlockLevel: 20, description: "Sombra amable para dias claros.", bonus: { health: 2, joy: 2 } },
  { id: "capa-paja", name: "Capa de paja", type: "body", price: 145, emoji: "Paja", rarity: "common", material: "paja", unlockLevel: 20, description: "Raspa un poquito, acompana bastante.", bonus: { discipline: 2, health: 1 } },
  { id: "fondo-campo", name: "Fondo campo", type: "background", price: 160, emoji: "Paja", rarity: "rare", material: "paja", unlockLevel: 20, description: "Un campo suave para respirar.", bonus: { joy: 2, health: 1 } },
  { id: "mascota-polillita", name: "Polillita de paja", type: "pet", price: 170, emoji: "Polilla", rarity: "rare", material: "paja", unlockLevel: 20, description: "Revolotea suave cuando completas algo.", bonus: { creativity: 1, joy: 3 } },

  { id: "gorro-hoja", name: "Gorro de hoja", type: "head", price: 190, emoji: "Hoja", rarity: "common", material: "planta", unlockLevel: 30, description: "Una hojita fresca para salir al mundo.", bonus: { health: 3, joy: 2 } },
  { id: "capa-musgo", name: "Capa de musgo", type: "body", price: 210, emoji: "Planta", rarity: "rare", material: "planta", unlockLevel: 30, description: "Suave como un descanso verde.", bonus: { health: 2, creativity: 2 } },
  { id: "fondo-bosque", name: "Fondo bosque", type: "background", price: 230, emoji: "Bosque", rarity: "rare", material: "planta", unlockLevel: 30, description: "Un rincon verde para descansar.", bonus: { health: 3, discipline: 1, joy: 1 } },
  { id: "mascota-brote", name: "Brote caminante", type: "pet", price: 240, emoji: "Brote", rarity: "rare", material: "planta", unlockLevel: 30, description: "Una plantita que aprendio a acompanar.", bonus: { health: 3, social: 2 } },

  { id: "botas-goma", name: "Botas de goma", type: "accessory", price: 260, emoji: "Goma", rarity: "common", material: "goma", unlockLevel: 40, description: "Para avanzar aunque el camino este raro.", bonus: { health: 2, discipline: 3 } },
  { id: "traje-comfy", name: "Traje comfy", type: "body", price: 280, emoji: "Goma", rarity: "common", material: "goma", unlockLevel: 40, description: "Ropa para volver despacito.", bonus: { joy: 4 } },
  { id: "auriculares-nube", name: "Auriculares nube", type: "accessory", price: 300, emoji: "Nube", rarity: "rare", material: "goma", unlockLevel: 40, description: "Para escuchar algo que abrace.", bonus: { creativity: 3, joy: 2 } },
  { id: "mascota-slime", name: "Slime blandito", type: "pet", price: 320, emoji: "Slime", rarity: "rare", material: "goma", unlockLevel: 40, description: "Rebota sin apurar a nadie.", bonus: { joy: 4, social: 1 } },

  { id: "espada-madera", name: "Espada de madera", type: "weapon", price: 340, emoji: "Rama", rarity: "common", material: "madera", unlockLevel: 50, description: "Para cortar malezas imaginarias.", bonus: { discipline: 3, creativity: 2 } },
  { id: "mochila-simple", name: "Mochila de madera", type: "backpack", price: 360, emoji: "Madera", rarity: "common", material: "madera", unlockLevel: 50, description: "Guarda tus pasos y tus ganas.", bonus: { discipline: 4 } },
  { id: "varita-madera", name: "Varita de madera", type: "weapon", price: 390, emoji: "Madera", rarity: "rare", material: "madera", unlockLevel: 50, description: "Para recordar que crear tambien cuenta.", bonus: { creativity: 4, joy: 1 } },
  { id: "mascota-zorrito", name: "Zorrito de madera", type: "pet", price: 410, emoji: "Zorrito", rarity: "rare", material: "madera", unlockLevel: 50, description: "Curioso, calmo y muy companero.", bonus: { social: 3, creativity: 2, joy: 1 } },

  { id: "gorra-chapa", name: "Gorra de chapa", type: "head", price: 430, emoji: "Chapa", rarity: "common", material: "chapa", unlockLevel: 60, description: "Brilla poquito, protege bastante.", bonus: { health: 3, discipline: 3 } },
  { id: "capa-chapa", name: "Capa de chapa liviana", type: "body", price: 460, emoji: "Chapa", rarity: "rare", material: "chapa", unlockLevel: 60, description: "Una mejora firme sin ponerse pesada.", bonus: { discipline: 4, social: 1 } },
  { id: "fondo-taller", name: "Fondo taller", type: "background", price: 480, emoji: "Chapa", rarity: "rare", material: "chapa", unlockLevel: 60, description: "Un lugar para arreglar de a poco.", bonus: { intelligence: 3, discipline: 2 } },
  { id: "mascota-tortuga", name: "Tortuga de chapa", type: "pet", price: 500, emoji: "Tortuga", rarity: "rare", material: "chapa", unlockLevel: 60, description: "Firme y lenta, como una buena racha.", bonus: { discipline: 4, health: 2 } },

  { id: "casco-metal", name: "Casco de metal suave", type: "head", price: 540, emoji: "Metal", rarity: "rare", material: "metal", unlockLevel: 70, description: "Firme, redondo y nada agresivo.", bonus: { health: 4, discipline: 3 } },
  { id: "mochila-metal", name: "Mochila de metal liviano", type: "backpack", price: 570, emoji: "Metal", rarity: "rare", material: "metal", unlockLevel: 70, description: "Para cargar recursos sin apuro.", bonus: { discipline: 5, intelligence: 1 } },
  { id: "mascota-robotito", name: "Mascota robotito", type: "pet", price: 620, emoji: "Metal", rarity: "epic", material: "metal", unlockLevel: 70, description: "Hace bip bajito cuando seguis.", bonus: { intelligence: 3, social: 2, joy: 2 } },

  { id: "corona-oro", name: "Corona de oro tibio", type: "head", price: 720, emoji: "Oro", rarity: "epic", material: "oro", unlockLevel: 80, description: "No manda: celebra.", bonus: { social: 4, joy: 3 } },
  { id: "capa-estrella", name: "Capa estrella dorada", type: "body", price: 760, emoji: "Oro", rarity: "epic", material: "oro", unlockLevel: 80, description: "Brilla sin apurarte.", bonus: { creativity: 4, social: 3, joy: 2 } },
  { id: "fondo-sol", name: "Fondo sol dorado", type: "background", price: 800, emoji: "Oro", rarity: "epic", material: "oro", unlockLevel: 80, description: "Un amanecer ganado con paciencia.", bonus: { joy: 5, health: 2 } },
  { id: "mascota-ciervo-sol", name: "Ciervo solar", type: "pet", price: 850, emoji: "Ciervo", rarity: "epic", material: "oro", unlockLevel: 80, description: "Grande, sereno y luminoso.", bonus: { social: 4, health: 3, joy: 3 } },

  { id: "amuleto-rubi", name: "Amuleto rubi", type: "accessory", price: 920, emoji: "Rubi", rarity: "epic", material: "rubi", unlockLevel: 90, description: "Guarda una chispa de constancia.", bonus: { discipline: 5, joy: 3 } },
  { id: "capa-rubi", name: "Capa rubi", type: "body", price: 980, emoji: "Rubi", rarity: "epic", material: "rubi", unlockLevel: 90, description: "Para cuando volver ya es parte de vos.", bonus: { creativity: 4, social: 4, joy: 3 } },
  { id: "mascota-rubi", name: "Dragon rubi tranquilo", type: "pet", price: 1050, emoji: "Dragon", rarity: "epic", material: "rubi", unlockLevel: 90, description: "Gigante, mitologico y sorprendentemente mimoso.", bonus: { social: 5, joy: 4 } },
  { id: "mascota-ballena-celeste", name: "Ballena celeste", type: "pet", price: 1120, emoji: "Ballena", rarity: "epic", material: "rubi", unlockLevel: 90, description: "Flota despacio y cuida el silencio.", bonus: { joy: 5, creativity: 3, social: 2 } },

  { id: "buso-capucha", name: "Buzo con capucha", type: "body", price: 1250, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 5, description: "Un buzo propio para dias de volver despacio.", bonus: { discipline: 3, joy: 4 } },
  { id: "auriculares-calle", name: "Auriculares de calle", type: "accessory", price: 1100, emoji: "Especial", rarity: "rare", material: "especial", unlockLevel: 15, description: "Musica para caminar a tu ritmo.", bonus: { joy: 3, creativity: 2 } },
  { id: "tattoos-suaves", name: "Tattoos temporales", type: "accessory", price: 1450, emoji: "Especial", rarity: "rare", material: "especial", unlockLevel: 25, description: "Marquitas esteticas, sin compromiso.", bonus: { creativity: 3, social: 3, joy: 2 } },
  { id: "cuernos-diablito", name: "Cuernitos traviesos", type: "head", price: 1500, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 35, description: "Picardia tierna, cero maldad.", bonus: { creativity: 4, joy: 4 } },
  { id: "corona-angel", name: "Corona de angel", type: "head", price: 1500, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 35, description: "Luz suave para cuando te trataste bien.", bonus: { social: 4, joy: 4 } },
  { id: "headphones-pro", name: "Headphones pro", type: "accessory", price: 1350, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 45, description: "Para entrar en modo foco sin aislarte del mundo.", bonus: { intelligence: 4, creativity: 3 } },
  { id: "pinturas-esteticas", name: "Pinturas esteticas", type: "weapon", price: 1600, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 45, description: "Colores para convertir el dia en algo tuyo.", bonus: { creativity: 6, joy: 2 } },
  { id: "alas-angel", name: "Alas de angel", type: "accessory", price: 1800, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 55, description: "Alas claras para levantar el animo.", bonus: { health: 3, social: 4, joy: 4 } },
  { id: "alas-demonio", name: "Alas de demonio cute", type: "accessory", price: 1800, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 55, description: "Dramaticas, suaves y bastante cancheras.", bonus: { creativity: 5, discipline: 3, joy: 3 } },
  { id: "skate-suave", name: "Skate suave", type: "accessory", price: 1700, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 65, description: "Para deslizarte sin apuro.", bonus: { health: 4, joy: 4 } },
  { id: "patines-nube", name: "Patines nube", type: "accessory", price: 1700, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 75, description: "Rueditas livianas para dias mejores.", bonus: { health: 4, discipline: 2, joy: 3 } },
  { id: "notebook-stickers", name: "Notebook con stickers", type: "backpack", price: 1900, emoji: "Especial", rarity: "epic", material: "especial", unlockLevel: 85, description: "Tu estacion portatil para programar, escribir o crear.", bonus: { intelligence: 6, creativity: 3 } }
];
