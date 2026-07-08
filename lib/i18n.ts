import type { Activity, ActivityUnit, Category, ShopItem } from "./types";

export const supportedLocales = ["es", "en", "pt", "ja", "ru", "tr"] as const;
export type Locale = (typeof supportedLocales)[number];

export const LOCALE_STORAGE_KEY = "volver-a-mi-locale";

export const localeNames: Record<Locale, string> = {
  es: "Espanol",
  en: "English",
  pt: "Portugues",
  ja: "日本語",
  ru: "Русский",
  tr: "Turkce"
};

export const localeShortNames: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
  ja: "JA",
  ru: "RU",
  tr: "TR"
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function resolveLocale(language: string | null | undefined): Locale {
  const normalized = (language ?? "").toLowerCase();
  const base = normalized.split(/[-_]/)[0];
  if (base === "en") return "en";
  if (base === "pt") return "pt";
  if (base === "ja") return "ja";
  if (base === "ru") return "ru";
  if (base === "tr") return "tr";
  return "es";
}

export function toIntlLocale(locale: Locale) {
  if (locale === "en") return "en-US";
  if (locale === "pt") return "pt-BR";
  if (locale === "ja") return "ja-JP";
  if (locale === "ru") return "ru-RU";
  if (locale === "tr") return "tr-TR";
  return "es-AR";
}

const esCopy = {
  language: "Idioma",
  menuAria: "Menu",
  remindersAria: "Recordatorios",
  greeting: "Hola, {name}!",
  subtitle: "Pequenos pasos, grandes cambios.",
  level: "Nivel",
  coins: "monedas",
  energy: "energia",
  viewToday: "Hoy",
  viewWeek: "Semana",
  viewMonth: "Mes",
  viewWorld: "Mundo",
  viewAvatar: "Avatar",
  viewStats: "Estadisticas",
  viewShop: "Tienda",
  viewNew: "Nueva",
  viewFriends: "Amigos",
  toolWorld: "Mi mundo",
  toolShop: "Tienda",
  toolNewActivity: "Nueva actividad",
  remoteLoadError: "No pude conectar con la base. Guardo local por ahora.",
  remoteSaveError: "No pude guardar en la base. Queda guardado en este navegador.",
  paceLimit: "Cuidamos el ritmo: por ahora tu limite recomendado es {capacity} {unit}.",
  completedToast: "Pequena promesa cumplida. +{xp} XP",
  partialToast: "Progreso guardado. De a poquito tambien cuenta.",
  movedToast: "La movimos a manana sin culpa.",
  notDoneToast: "Gracias por ser honesto. Un dia dificil no borra tu progreso. +{xp} XP",
  movedTodayToast: "Movi el progreso de hoy al {date}.",
  movedDayToast: "Movi el progreso del {from} al {to}.",
  newActivityDefaultName: "Nueva actividad",
  newActivityToast: "Tu camino tiene una nueva promesa.",
  itemEquippedToast: "Objeto equipado con ternura.",
  itemUnlockToast: "Se desbloquea en nivel {level}.",
  itemAlreadyEquippedToast: "Ya lo tenes equipado.",
  notEnoughCoinsToast: "Todavia faltan algunas monedas.",
  avatarEquippedToast: "Listo, queda puesto.",
  inventorySavedToast: "Guardado en el inventario.",
  todayTitle: "Hoy es un buen dia para...",
  moveTodayToYesterday: "Mover progreso de hoy a ayer",
  addActivity: "Agregar actividad",
  manualAmountPrompt: "Cantidad realizada",
  goal: "Objetivo",
  capacityUnlocked: "Capacidad desbloqueada",
  limitIn: "+limite en {remaining} completados",
  load: "Cargar",
  move: "Mover",
  couldNot: "No pude",
  addOneAria: "Sumar uno a {activity}",
  completeAria: "Completar {activity}",
  calendar: "Calendario",
  completedActivities: "{completed}/{total} actividades completadas",
  noCompletedDay: "Manana volvemos al camino.",
  moveDayPrevious: "Mover este dia al dia anterior",
  weeklySummary: "Resumen semanal",
  days: "dias",
  worldTitle: "Mi mundo",
  worldEmpty: "Completa una actividad y el primer rincon del mundo va a aparecer.",
  zones: "zonas",
  levelShort: "Nv",
  progressPlural: "progresos",
  special: "Especial",
  next: "Siguiente",
  statsTitle: "Estadisticas",
  monthlyCompletion: "Cumplimiento mensual",
  daysCompleted: "Dias completados",
  activeDays: "Dias activos",
  bestStreak: "Mejor racha",
  currentStreak: "Racha actual",
  tasksToday: "Tareas de hoy",
  tasksWeek: "Tareas de esta semana",
  tasksMonth: "Tareas de este mes",
  pendingCount: "{count} pendientes",
  allDone: "Todo listo",
  dailyActivitiesEmpty: "Todavia no tenes actividades diarias.",
  weeklyActivitiesTitle: "Actividades semanales",
  weeklyActivitiesDescription: "Objetivos para completar durante esta semana.",
  weeklyActivitiesEmpty: "Todavia no tenes actividades semanales.",
  monthlyActivitiesTitle: "Actividades mensuales",
  monthlyActivitiesDescription: "Objetivos para completar durante este mes.",
  monthlyActivitiesEmpty: "Todavia no tenes actividades mensuales.",
  periodProgress: "{done} de {target} veces {period}",
  thisWeek: "esta semana",
  thisMonth: "este mes",
  goalCompleted: "Objetivo completado",
  remainingToComplete: "{count} por completar",
  deleteAction: "Eliminar",
  weeklyChallenge: "Desafio semanal",
  challengeSubtitle: "Completa actividades diarias durante esta semana.",
  achievements: "Logros",
  streakProtection: "Protecciones de racha",
  weeklyEvolution: "Evolucion de las ultimas semanas",
  completedCount: "{count} completadas",
  achievementUnlocked: "Desbloqueado",
  achievementLocked: "Todavia bloqueado",
  activitySummary: "Resumen por actividad",
  categoryProgress: "Progreso por categoria",
  base: "base",
  equipment: "equipo",
  character: "Tu personaje",
  characterSettingsHelp: "La apariencia es una configuracion ocasional. Tu progreso vive en las actividades.",
  customizeCharacter: "Editar apariencia",
  closeEditor: "Cerrar editor",
  equippedNow: "Equipado ahora",
  remove: "Sacar",
  noEquippedItems: "Todavia no hay objetos equipados.",
  inventory: "Inventario",
  inventoryHelp: "Pone o saca objetos comprados desde aca.",
  itemCount: "{count} objetos",
  shopEmpty: "Cuando compres algo en la tienda, va a aparecer aca para equiparlo.",
  shopTitle: "Tienda",
  nextMaterial: "Proximo material: {material} en nivel {level}",
  allMaterialsUnlocked: "Todos los materiales desbloqueados.",
  materialLevel: "{material} - Nv {level}",
  lockedLevel: "Se desbloquea en nivel {level}",
  costsCoins: "Cuesta {price} monedas",
  coinsCount: "Monedas {coins}",
  locked: "Bloqueado",
  equipped: "Equipado",
  equip: "Equipar",
  buy: "Comprar",
  newActivityTitle: "Nueva actividad",
  name: "Nombre",
  type: "Tipo",
  daily: "Diaria",
  weekly: "Semanal",
  monthly: "Mensual",
  unit: "Unidad",
  target: "Objetivo",
  category: "Categoria",
  icon: "Icono",
  color: "Color",
  notes: "Notas",
  optional: "Opcional",
  createActivity: "Crear actividad",
  exampleRead: "Ej: Leer",
  noBonus: "Sin bonus"
} as const;

type CopyKey = keyof typeof esCopy;

const copy: Record<Locale, Record<CopyKey, string>> = {
  es: esCopy,
  en: {
    language: "Language",
    menuAria: "Menu",
    remindersAria: "Reminders",
    greeting: "Hi, {name}!",
    subtitle: "Small steps, big changes.",
    level: "Level",
    coins: "coins",
    energy: "energy",
    viewToday: "Today",
    viewWeek: "Week",
    viewMonth: "Month",
    viewWorld: "World",
    viewAvatar: "Avatar",
    viewStats: "Stats",
    viewShop: "Shop",
    viewNew: "New",
    viewFriends: "Friends",
    toolWorld: "My world",
    toolShop: "Shop",
    toolNewActivity: "New activity",
    remoteLoadError: "I could not connect to the database. Saving locally for now.",
    remoteSaveError: "I could not save to the database. It stays saved in this browser.",
    paceLimit: "Pacing gently: your recommended limit for now is {capacity} {unit}.",
    completedToast: "Small promise kept. +{xp} XP",
    partialToast: "Progress saved. Little by little counts too.",
    movedToast: "Moved to tomorrow without guilt.",
    notDoneToast: "Thanks for being honest. A hard day does not erase your progress. +{xp} XP",
    movedTodayToast: "I moved today's progress to {date}.",
    movedDayToast: "I moved the progress from {from} to {to}.",
    newActivityDefaultName: "New activity",
    newActivityToast: "Your path has a new promise.",
    itemEquippedToast: "Item equipped gently.",
    itemUnlockToast: "Unlocks at level {level}.",
    itemAlreadyEquippedToast: "You already have it equipped.",
    notEnoughCoinsToast: "You still need a few coins.",
    avatarEquippedToast: "Done, it stays equipped.",
    inventorySavedToast: "Saved in the inventory.",
    todayTitle: "Today is a good day to...",
    moveTodayToYesterday: "Move today's progress to yesterday",
    addActivity: "Add activity",
    manualAmountPrompt: "Amount completed",
    goal: "Goal",
    capacityUnlocked: "Unlocked capacity",
    limitIn: "+limit in {remaining} completions",
    load: "Log",
    move: "Move",
    couldNot: "Could not",
    addOneAria: "Add one to {activity}",
    completeAria: "Complete {activity}",
    calendar: "Calendar",
    completedActivities: "{completed}/{total} activities completed",
    noCompletedDay: "Tomorrow we return to the path.",
    moveDayPrevious: "Move this day to the previous day",
    weeklySummary: "Weekly summary",
    days: "days",
    worldTitle: "My world",
    worldEmpty: "Complete an activity and the first corner of the world will appear.",
    zones: "zones",
    levelShort: "Lv",
    progressPlural: "progress",
    special: "Special",
    next: "Next",
    statsTitle: "Stats",
    monthlyCompletion: "Monthly completion",
    daysCompleted: "Completed days",
    activeDays: "Active days",
    bestStreak: "Best streak",
    currentStreak: "Current streak",
    tasksToday: "Today's tasks",
    tasksWeek: "This week's tasks",
    tasksMonth: "This month's tasks",
    pendingCount: "{count} pending",
    allDone: "All done",
    dailyActivitiesEmpty: "You do not have daily activities yet.",
    weeklyActivitiesTitle: "Weekly activities",
    weeklyActivitiesDescription: "Goals to complete during this week.",
    weeklyActivitiesEmpty: "You do not have weekly activities yet.",
    monthlyActivitiesTitle: "Monthly activities",
    monthlyActivitiesDescription: "Goals to complete during this month.",
    monthlyActivitiesEmpty: "You do not have monthly activities yet.",
    periodProgress: "{done} of {target} times {period}",
    thisWeek: "this week",
    thisMonth: "this month",
    goalCompleted: "Goal completed",
    remainingToComplete: "{count} remaining",
    deleteAction: "Delete",
    weeklyChallenge: "Weekly challenge",
    challengeSubtitle: "Complete daily activities during this week.",
    achievements: "Achievements",
    streakProtection: "Streak protections",
    weeklyEvolution: "Recent weekly progress",
    completedCount: "{count} completed",
    achievementUnlocked: "Unlocked",
    achievementLocked: "Still locked",
    activitySummary: "Activity summary",
    categoryProgress: "Category progress",
    base: "base",
    equipment: "gear",
    character: "Your character",
    characterSettingsHelp: "Appearance is an occasional setting. Your progress lives in your activities.",
    customizeCharacter: "Edit appearance",
    closeEditor: "Close editor",
    equippedNow: "Equipped now",
    remove: "Remove",
    noEquippedItems: "No items equipped yet.",
    inventory: "Inventory",
    inventoryHelp: "Equip or remove purchased items from here.",
    itemCount: "{count} items",
    shopEmpty: "When you buy something in the shop, it will appear here to equip.",
    shopTitle: "Shop",
    nextMaterial: "Next material: {material} at level {level}",
    allMaterialsUnlocked: "All materials unlocked.",
    materialLevel: "{material} - Lv {level}",
    lockedLevel: "Unlocks at level {level}",
    costsCoins: "Costs {price} coins",
    coinsCount: "Coins {coins}",
    locked: "Locked",
    equipped: "Equipped",
    equip: "Equip",
    buy: "Buy",
    newActivityTitle: "New activity",
    name: "Name",
    type: "Type",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    unit: "Unit",
    target: "Goal",
    category: "Category",
    icon: "Icon",
    color: "Color",
    notes: "Notes",
    optional: "Optional",
    createActivity: "Create activity",
    exampleRead: "Ex: Read",
    noBonus: "No bonus"
  },
  pt: {
    language: "Idioma",
    menuAria: "Menu",
    remindersAria: "Lembretes",
    greeting: "Oi, {name}!",
    subtitle: "Passos pequenos, grandes mudancas.",
    level: "Nivel",
    coins: "moedas",
    energy: "energia",
    viewToday: "Hoje",
    viewWeek: "Semana",
    viewMonth: "Mes",
    viewWorld: "Mundo",
    viewAvatar: "Avatar",
    viewStats: "Stats",
    viewShop: "Loja",
    viewNew: "Nova",
    viewFriends: "Amigos",
    toolWorld: "Meu mundo",
    toolShop: "Loja",
    toolNewActivity: "Nova atividade",
    remoteLoadError: "Nao consegui conectar com a base. Vou salvar local por enquanto.",
    remoteSaveError: "Nao consegui salvar na base. Fica salvo neste navegador.",
    paceLimit: "Cuidando do ritmo: por agora seu limite recomendado e {capacity} {unit}.",
    completedToast: "Pequena promessa cumprida. +{xp} XP",
    partialToast: "Progresso salvo. De pouquinho tambem conta.",
    movedToast: "Movida para amanha sem culpa.",
    notDoneToast: "Obrigado por ser honesto. Um dia dificil nao apaga seu progresso. +{xp} XP",
    movedTodayToast: "Movi o progresso de hoje para {date}.",
    movedDayToast: "Movi o progresso de {from} para {to}.",
    newActivityDefaultName: "Nova atividade",
    newActivityToast: "Seu caminho tem uma nova promessa.",
    itemEquippedToast: "Item equipado com carinho.",
    itemUnlockToast: "Desbloqueia no nivel {level}.",
    itemAlreadyEquippedToast: "Voce ja esta usando isso.",
    notEnoughCoinsToast: "Ainda faltam algumas moedas.",
    avatarEquippedToast: "Pronto, ficou equipado.",
    inventorySavedToast: "Guardado no inventario.",
    todayTitle: "Hoje e um bom dia para...",
    moveTodayToYesterday: "Mover progresso de hoje para ontem",
    addActivity: "Adicionar atividade",
    manualAmountPrompt: "Quantidade realizada",
    goal: "Objetivo",
    capacityUnlocked: "Capacidade desbloqueada",
    limitIn: "+limite em {remaining} conclusoes",
    load: "Carregar",
    move: "Mover",
    couldNot: "Nao deu",
    addOneAria: "Somar um a {activity}",
    completeAria: "Completar {activity}",
    calendar: "Calendario",
    completedActivities: "{completed}/{total} atividades completas",
    noCompletedDay: "Amanha voltamos ao caminho.",
    moveDayPrevious: "Mover este dia para o dia anterior",
    weeklySummary: "Resumo semanal",
    days: "dias",
    worldTitle: "Meu mundo",
    worldEmpty: "Complete uma atividade e o primeiro canto do mundo vai aparecer.",
    zones: "zonas",
    levelShort: "Nv",
    progressPlural: "progressos",
    special: "Especial",
    next: "Proximo",
    statsTitle: "Estatisticas",
    monthlyCompletion: "Cumprimento mensal",
    daysCompleted: "Dias completos",
    activeDays: "Dias ativos",
    bestStreak: "Melhor sequencia",
    currentStreak: "Sequencia atual",
    tasksToday: "Tarefas de hoje",
    tasksWeek: "Tarefas desta semana",
    tasksMonth: "Tarefas deste mes",
    pendingCount: "{count} pendentes",
    allDone: "Tudo pronto",
    dailyActivitiesEmpty: "Voce ainda nao tem atividades diarias.",
    weeklyActivitiesTitle: "Atividades semanais",
    weeklyActivitiesDescription: "Objetivos para concluir durante esta semana.",
    weeklyActivitiesEmpty: "Voce ainda nao tem atividades semanais.",
    monthlyActivitiesTitle: "Atividades mensais",
    monthlyActivitiesDescription: "Objetivos para concluir durante este mes.",
    monthlyActivitiesEmpty: "Voce ainda nao tem atividades mensais.",
    periodProgress: "{done} de {target} vezes {period}",
    thisWeek: "esta semana",
    thisMonth: "este mes",
    goalCompleted: "Objetivo concluido",
    remainingToComplete: "Faltam {count}",
    deleteAction: "Excluir",
    weeklyChallenge: "Desafio semanal",
    challengeSubtitle: "Complete atividades diarias durante esta semana.",
    achievements: "Conquistas",
    streakProtection: "Protecoes de sequencia",
    weeklyEvolution: "Evolucao das ultimas semanas",
    completedCount: "{count} concluidas",
    achievementUnlocked: "Desbloqueado",
    achievementLocked: "Ainda bloqueado",
    activitySummary: "Resumo por atividade",
    categoryProgress: "Progresso por categoria",
    base: "base",
    equipment: "equipamento",
    character: "Seu personagem",
    characterSettingsHelp: "A aparencia e uma configuracao ocasional. Seu progresso vive nas atividades.",
    customizeCharacter: "Editar aparencia",
    closeEditor: "Fechar editor",
    equippedNow: "Equipado agora",
    remove: "Tirar",
    noEquippedItems: "Ainda nao ha itens equipados.",
    inventory: "Inventario",
    inventoryHelp: "Coloque ou tire itens comprados daqui.",
    itemCount: "{count} itens",
    shopEmpty: "Quando voce comprar algo na loja, vai aparecer aqui para equipar.",
    shopTitle: "Loja",
    nextMaterial: "Proximo material: {material} no nivel {level}",
    allMaterialsUnlocked: "Todos os materiais desbloqueados.",
    materialLevel: "{material} - Nv {level}",
    lockedLevel: "Desbloqueia no nivel {level}",
    costsCoins: "Custa {price} moedas",
    coinsCount: "Moedas {coins}",
    locked: "Bloqueado",
    equipped: "Equipado",
    equip: "Equipar",
    buy: "Comprar",
    newActivityTitle: "Nova atividade",
    name: "Nome",
    type: "Tipo",
    daily: "Diaria",
    weekly: "Semanal",
    monthly: "Mensal",
    unit: "Unidade",
    target: "Objetivo",
    category: "Categoria",
    icon: "Icone",
    color: "Cor",
    notes: "Notas",
    optional: "Opcional",
    createActivity: "Criar atividade",
    exampleRead: "Ex: Ler",
    noBonus: "Sem bonus"
  },
  ja: {
    language: "言語",
    menuAria: "メニュー",
    remindersAria: "リマインダー",
    greeting: "こんにちは、{name}!",
    subtitle: "小さな一歩が、大きな変化へ。",
    level: "レベル",
    coins: "コイン",
    energy: "エネルギー",
    viewToday: "今日",
    viewWeek: "週",
    viewMonth: "月",
    viewWorld: "世界",
    viewAvatar: "アバター",
    viewStats: "統計",
    viewShop: "ショップ",
    viewNew: "新規",
    viewFriends: "友達",
    toolWorld: "私の世界",
    toolShop: "ショップ",
    toolNewActivity: "新しい習慣",
    remoteLoadError: "データベースに接続できませんでした。今はこの端末に保存します。",
    remoteSaveError: "データベースに保存できませんでした。このブラウザに保存されています。",
    paceLimit: "無理なく進めましょう。今のおすすめ上限は {capacity} {unit} です。",
    completedToast: "小さな約束を達成しました。+{xp} XP",
    partialToast: "進捗を保存しました。少しずつでも大丈夫。",
    movedToast: "罪悪感なく明日に移しました。",
    notDoneToast: "正直に記録してくれてありがとう。大変な一日でも、進歩は消えません。+{xp} XP",
    movedTodayToast: "今日の進捗を {date} に移しました。",
    movedDayToast: "{from} の進捗を {to} に移しました。",
    newActivityDefaultName: "新しい習慣",
    newActivityToast: "あなたの道に新しい約束が増えました。",
    itemEquippedToast: "アイテムを装備しました。",
    itemUnlockToast: "レベル {level} で解放されます。",
    itemAlreadyEquippedToast: "すでに装備しています。",
    notEnoughCoinsToast: "コインがまだ少し足りません。",
    avatarEquippedToast: "完了、装備しました。",
    inventorySavedToast: "インベントリに保存しました。",
    todayTitle: "今日はこれをするのにいい日...",
    moveTodayToYesterday: "今日の進捗を昨日へ移す",
    addActivity: "習慣を追加",
    manualAmountPrompt: "実行した量",
    goal: "目標",
    capacityUnlocked: "解放済み容量",
    limitIn: "あと {remaining} 回で上限アップ",
    load: "記録",
    move: "移動",
    couldNot: "できなかった",
    addOneAria: "{activity} を1つ追加",
    completeAria: "{activity} を完了",
    calendar: "カレンダー",
    completedActivities: "{completed}/{total} 個の習慣を完了",
    noCompletedDay: "明日また道に戻りましょう。",
    moveDayPrevious: "この日を前日に移す",
    weeklySummary: "週間サマリー",
    days: "日",
    worldTitle: "私の世界",
    worldEmpty: "習慣を1つ完了すると、世界の最初の場所が現れます。",
    zones: "エリア",
    levelShort: "Lv",
    progressPlural: "進捗",
    special: "スペシャル",
    next: "次",
    statsTitle: "統計",
    monthlyCompletion: "月間達成率",
    daysCompleted: "完了日数",
    activeDays: "活動日数",
    bestStreak: "最高連続日数",
    currentStreak: "現在の連続日数",
    tasksToday: "今日のタスク",
    tasksWeek: "今週のタスク",
    tasksMonth: "今月のタスク",
    pendingCount: "残り {count} 件",
    allDone: "すべて完了",
    dailyActivitiesEmpty: "毎日の習慣はまだありません。",
    weeklyActivitiesTitle: "週間の習慣",
    weeklyActivitiesDescription: "今週中に達成する目標です。",
    weeklyActivitiesEmpty: "週間の習慣はまだありません。",
    monthlyActivitiesTitle: "月間の習慣",
    monthlyActivitiesDescription: "今月中に達成する目標です。",
    monthlyActivitiesEmpty: "月間の習慣はまだありません。",
    periodProgress: "{period}に{target}回中{done}回",
    thisWeek: "今週",
    thisMonth: "今月",
    goalCompleted: "目標達成",
    remainingToComplete: "残り{count}回",
    deleteAction: "削除",
    weeklyChallenge: "週間チャレンジ",
    challengeSubtitle: "今週の毎日の習慣を完了しましょう。",
    achievements: "実績",
    streakProtection: "連続記録プロテクト",
    weeklyEvolution: "最近の週間推移",
    completedCount: "{count} 件完了",
    achievementUnlocked: "解除済み",
    achievementLocked: "未解除",
    activitySummary: "習慣別サマリー",
    categoryProgress: "カテゴリ別進捗",
    base: "基本",
    equipment: "装備",
    character: "あなたのキャラクター",
    characterSettingsHelp: "見た目の変更は必要な時だけ。進歩の中心は毎日の習慣です。",
    customizeCharacter: "見た目を編集",
    closeEditor: "編集を閉じる",
    equippedNow: "現在の装備",
    remove: "外す",
    noEquippedItems: "まだ装備中のアイテムはありません。",
    inventory: "インベントリ",
    inventoryHelp: "購入したアイテムをここで装備または外せます。",
    itemCount: "{count} 個",
    shopEmpty: "ショップで購入すると、ここに表示されて装備できます。",
    shopTitle: "ショップ",
    nextMaterial: "次の素材: {material} はレベル {level} で解放",
    allMaterialsUnlocked: "すべての素材が解放済みです。",
    materialLevel: "{material} - Lv {level}",
    lockedLevel: "レベル {level} で解放",
    costsCoins: "{price} コイン",
    coinsCount: "コイン {coins}",
    locked: "ロック中",
    equipped: "装備中",
    equip: "装備",
    buy: "購入",
    newActivityTitle: "新しい習慣",
    name: "名前",
    type: "種類",
    daily: "毎日",
    weekly: "毎週",
    monthly: "毎月",
    unit: "単位",
    target: "目標",
    category: "カテゴリ",
    icon: "アイコン",
    color: "色",
    notes: "メモ",
    optional: "任意",
    createActivity: "習慣を作成",
    exampleRead: "例: 読書",
    noBonus: "ボーナスなし"
  },
  ru: {
    language: "Язык",
    menuAria: "Меню",
    remindersAria: "Напоминания",
    greeting: "Привет, {name}!",
    subtitle: "Маленькие шаги, большие перемены.",
    level: "Уровень",
    coins: "монеты",
    energy: "энергия",
    viewToday: "Сегодня",
    viewWeek: "Неделя",
    viewMonth: "Месяц",
    viewWorld: "Мир",
    viewAvatar: "Аватар",
    viewStats: "Статистика",
    viewShop: "Магазин",
    viewNew: "Новое",
    viewFriends: "Друзья",
    toolWorld: "Мой мир",
    toolShop: "Магазин",
    toolNewActivity: "Новая привычка",
    remoteLoadError: "Не удалось подключиться к базе. Пока сохраняю локально.",
    remoteSaveError: "Не удалось сохранить в базе. Данные сохранены в этом браузере.",
    paceLimit: "Двигаемся бережно: текущий рекомендуемый лимит {capacity} {unit}.",
    completedToast: "Маленькое обещание выполнено. +{xp} XP",
    partialToast: "Прогресс сохранен. Понемногу тоже считается.",
    movedToast: "Перенесли на завтра без чувства вины.",
    notDoneToast: "Спасибо за честность. Трудный день не стирает твой прогресс. +{xp} XP",
    movedTodayToast: "Я перенес прогресс за сегодня на {date}.",
    movedDayToast: "Я перенес прогресс с {from} на {to}.",
    newActivityDefaultName: "Новая привычка",
    newActivityToast: "На твоем пути появилось новое обещание.",
    itemEquippedToast: "Предмет экипирован.",
    itemUnlockToast: "Откроется на уровне {level}.",
    itemAlreadyEquippedToast: "Он уже экипирован.",
    notEnoughCoinsToast: "Пока не хватает монет.",
    avatarEquippedToast: "Готово, экипировано.",
    inventorySavedToast: "Сохранено в инвентаре.",
    todayTitle: "Сегодня хороший день для...",
    moveTodayToYesterday: "Перенести прогресс за сегодня на вчера",
    addActivity: "Добавить привычку",
    manualAmountPrompt: "Выполненное количество",
    goal: "Цель",
    capacityUnlocked: "Открытая емкость",
    limitIn: "+лимит через {remaining} выполнений",
    load: "Записать",
    move: "Перенести",
    couldNot: "Не получилось",
    addOneAria: "Добавить один к {activity}",
    completeAria: "Завершить {activity}",
    calendar: "Календарь",
    completedActivities: "{completed}/{total} привычек выполнено",
    noCompletedDay: "Завтра вернемся на путь.",
    moveDayPrevious: "Перенести этот день на предыдущий",
    weeklySummary: "Итоги недели",
    days: "дн.",
    worldTitle: "Мой мир",
    worldEmpty: "Выполни одну привычку, и первый уголок мира появится.",
    zones: "зон",
    levelShort: "Ур",
    progressPlural: "прогресса",
    special: "Особое",
    next: "Далее",
    statsTitle: "Статистика",
    monthlyCompletion: "Выполнение за месяц",
    daysCompleted: "Завершенные дни",
    activeDays: "Активные дни",
    bestStreak: "Лучшая серия",
    currentStreak: "Текущая серия",
    tasksToday: "Задачи на сегодня",
    tasksWeek: "Задачи на неделю",
    tasksMonth: "Задачи на месяц",
    pendingCount: "Осталось: {count}",
    allDone: "Все готово",
    dailyActivitiesEmpty: "Ежедневных привычек пока нет.",
    weeklyActivitiesTitle: "Еженедельные привычки",
    weeklyActivitiesDescription: "Цели, которые нужно выполнить на этой неделе.",
    weeklyActivitiesEmpty: "Еженедельных привычек пока нет.",
    monthlyActivitiesTitle: "Ежемесячные привычки",
    monthlyActivitiesDescription: "Цели, которые нужно выполнить в этом месяце.",
    monthlyActivitiesEmpty: "Ежемесячных привычек пока нет.",
    periodProgress: "{done} из {target} раз {period}",
    thisWeek: "на этой неделе",
    thisMonth: "в этом месяце",
    goalCompleted: "Цель выполнена",
    remainingToComplete: "Осталось: {count}",
    deleteAction: "Удалить",
    weeklyChallenge: "Недельный вызов",
    challengeSubtitle: "Выполняй ежедневные привычки на этой неделе.",
    achievements: "Достижения",
    streakProtection: "Защита серии",
    weeklyEvolution: "Динамика последних недель",
    completedCount: "Выполнено: {count}",
    achievementUnlocked: "Открыто",
    achievementLocked: "Пока закрыто",
    activitySummary: "Итоги по привычкам",
    categoryProgress: "Прогресс по категориям",
    base: "база",
    equipment: "экипировка",
    character: "Твой персонаж",
    characterSettingsHelp: "Внешность меняется изредка. Главный прогресс находится в привычках.",
    customizeCharacter: "Изменить внешность",
    closeEditor: "Закрыть редактор",
    equippedNow: "Сейчас экипировано",
    remove: "Снять",
    noEquippedItems: "Пока ничего не экипировано.",
    inventory: "Инвентарь",
    inventoryHelp: "Здесь можно надевать и снимать купленные предметы.",
    itemCount: "{count} предметов",
    shopEmpty: "Когда ты купишь что-то в магазине, это появится здесь для экипировки.",
    shopTitle: "Магазин",
    nextMaterial: "Следующий материал: {material} на уровне {level}",
    allMaterialsUnlocked: "Все материалы открыты.",
    materialLevel: "{material} - Ур {level}",
    lockedLevel: "Откроется на уровне {level}",
    costsCoins: "Стоит {price} монет",
    coinsCount: "Монеты {coins}",
    locked: "Закрыто",
    equipped: "Экипировано",
    equip: "Надеть",
    buy: "Купить",
    newActivityTitle: "Новая привычка",
    name: "Название",
    type: "Тип",
    daily: "Ежедневно",
    weekly: "Еженедельно",
    monthly: "Ежемесячно",
    unit: "Единица",
    target: "Цель",
    category: "Категория",
    icon: "Иконка",
    color: "Цвет",
    notes: "Заметки",
    optional: "Необязательно",
    createActivity: "Создать привычку",
    exampleRead: "Напр.: Читать",
    noBonus: "Без бонуса"
  },
  tr: {
    language: "Dil",
    menuAria: "Menu",
    remindersAria: "Hatirlaticilar",
    greeting: "Merhaba, {name}!",
    subtitle: "Kucuk adimlar, buyuk degisimler.",
    level: "Seviye",
    coins: "jeton",
    energy: "enerji",
    viewToday: "Bugun",
    viewWeek: "Hafta",
    viewMonth: "Ay",
    viewWorld: "Dunya",
    viewAvatar: "Avatar",
    viewStats: "Istatistik",
    viewShop: "Magaza",
    viewNew: "Yeni",
    viewFriends: "Arkadaslar",
    toolWorld: "Dunyam",
    toolShop: "Magaza",
    toolNewActivity: "Yeni aliskanlik",
    remoteLoadError: "Veritabanina baglanamadim. Simdilik yerel kaydediyorum.",
    remoteSaveError: "Veritabanina kaydedemedim. Bu tarayicida kayitli kalacak.",
    paceLimit: "Ritmi koruyoruz: su an onerilen limitin {capacity} {unit}.",
    completedToast: "Kucuk soz tutuldu. +{xp} XP",
    partialToast: "Ilerleme kaydedildi. Az az da sayilir.",
    movedToast: "Sucluluk olmadan yarina tasindi.",
    notDoneToast: "Durust oldugun icin tesekkurler. Zor bir gun ilerlemeni silmez. +{xp} XP",
    movedTodayToast: "Bugunun ilerlemesini {date} tarihine tasidim.",
    movedDayToast: "{from} ilerlemesini {to} tarihine tasidim.",
    newActivityDefaultName: "Yeni aliskanlik",
    newActivityToast: "Yoluna yeni bir soz eklendi.",
    itemEquippedToast: "Esya takildi.",
    itemUnlockToast: "{level}. seviyede acilir.",
    itemAlreadyEquippedToast: "Zaten takili.",
    notEnoughCoinsToast: "Biraz daha jeton gerekiyor.",
    avatarEquippedToast: "Tamam, takili kaldi.",
    inventorySavedToast: "Envantere kaydedildi.",
    todayTitle: "Bugun sunlar icin guzel bir gun...",
    moveTodayToYesterday: "Bugunun ilerlemesini dune tasi",
    addActivity: "Aliskanlik ekle",
    manualAmountPrompt: "Yapilan miktar",
    goal: "Hedef",
    capacityUnlocked: "Acilan kapasite",
    limitIn: "+limit {remaining} tamamlamada",
    load: "Kaydet",
    move: "Tasi",
    couldNot: "Yapamadim",
    addOneAria: "{activity} icin bir ekle",
    completeAria: "{activity} tamamla",
    calendar: "Takvim",
    completedActivities: "{completed}/{total} aliskanlik tamamlandi",
    noCompletedDay: "Yarin yola geri doneriz.",
    moveDayPrevious: "Bu gunu onceki gune tasi",
    weeklySummary: "Haftalik ozet",
    days: "gun",
    worldTitle: "Dunyam",
    worldEmpty: "Bir aliskanlik tamamla, dunyanin ilk kosesi ortaya ciksin.",
    zones: "bolge",
    levelShort: "Sv",
    progressPlural: "ilerleme",
    special: "Ozel",
    next: "Sonraki",
    statsTitle: "Istatistik",
    monthlyCompletion: "Aylik tamamlama",
    daysCompleted: "Tamamlanan gunler",
    activeDays: "Aktif gunler",
    bestStreak: "En iyi seri",
    currentStreak: "Mevcut seri",
    tasksToday: "Bugunun gorevleri",
    tasksWeek: "Bu haftanin gorevleri",
    tasksMonth: "Bu ayin gorevleri",
    pendingCount: "{count} kaldi",
    allDone: "Hepsi tamam",
    dailyActivitiesEmpty: "Henuz gunluk aliskanligin yok.",
    weeklyActivitiesTitle: "Haftalik aliskanliklar",
    weeklyActivitiesDescription: "Bu hafta tamamlanacak hedefler.",
    weeklyActivitiesEmpty: "Henuz haftalik aliskanligin yok.",
    monthlyActivitiesTitle: "Aylik aliskanliklar",
    monthlyActivitiesDescription: "Bu ay tamamlanacak hedefler.",
    monthlyActivitiesEmpty: "Henuz aylik aliskanligin yok.",
    periodProgress: "{period} {target} kereden {done}",
    thisWeek: "bu hafta",
    thisMonth: "bu ay",
    goalCompleted: "Hedef tamamlandi",
    remainingToComplete: "{count} kaldi",
    deleteAction: "Sil",
    weeklyChallenge: "Haftalik meydan okuma",
    challengeSubtitle: "Bu hafta gunluk aliskanliklarini tamamla.",
    achievements: "Basarilar",
    streakProtection: "Seri korumalari",
    weeklyEvolution: "Son haftalarin gelisimi",
    completedCount: "{count} tamamlandi",
    achievementUnlocked: "Acildi",
    achievementLocked: "Henuz kilitli",
    activitySummary: "Aliskanlik ozeti",
    categoryProgress: "Kategori ilerlemesi",
    base: "temel",
    equipment: "ekipman",
    character: "Karakterin",
    characterSettingsHelp: "Gorunum ara sira degistirilen bir ayardir. Ilerlemen aliskanliklarindadir.",
    customizeCharacter: "Gorunumu duzenle",
    closeEditor: "Editoru kapat",
    equippedNow: "Su an takili",
    remove: "Cikar",
    noEquippedItems: "Henuz takili esya yok.",
    inventory: "Envanter",
    inventoryHelp: "Satin alinan esyalari buradan takabilir veya cikarabilirsin.",
    itemCount: "{count} esya",
    shopEmpty: "Magazadan bir sey aldiginda, takmak icin burada gorunecek.",
    shopTitle: "Magaza",
    nextMaterial: "Sonraki malzeme: {material}, seviye {level}",
    allMaterialsUnlocked: "Tum malzemeler acildi.",
    materialLevel: "{material} - Sv {level}",
    lockedLevel: "{level}. seviyede acilir",
    costsCoins: "{price} jeton",
    coinsCount: "Jeton {coins}",
    locked: "Kilitli",
    equipped: "Takili",
    equip: "Tak",
    buy: "Satın al",
    newActivityTitle: "Yeni aliskanlik",
    name: "Ad",
    type: "Tur",
    daily: "Gunluk",
    weekly: "Haftalik",
    monthly: "Aylik",
    unit: "Birim",
    target: "Hedef",
    category: "Kategori",
    icon: "Ikon",
    color: "Renk",
    notes: "Notlar",
    optional: "Istege bagli",
    createActivity: "Aliskanlik olustur",
    exampleRead: "Orn: Okumak",
    noBonus: "Bonus yok"
  }
};

export function t(locale: Locale, key: CopyKey, params: Record<string, string | number> = {}) {
  const template = copy[locale][key] ?? copy.es[key];
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? ""));
}

export const activityUnits: ActivityUnit[] = [
  "yes_no",
  "minutes",
  "hours",
  "kilometers",
  "meters",
  "glasses",
  "sets",
  "reps",
  "times",
  "pages",
  "healthy_meals",
  "text"
];

export const categories: Category[] = [
  "health",
  "creativity",
  "intelligence",
  "discipline",
  "social",
  "joy"
];

const unitLabels: Record<Locale, Record<ActivityUnit, string>> = {
  es: {
    yes_no: "Si / No",
    minutes: "min",
    hours: "h",
    kilometers: "km",
    meters: "m",
    glasses: "vasos",
    sets: "series",
    reps: "rep",
    times: "veces",
    pages: "paginas",
    healthy_meals: "comidas",
    text: "texto"
  },
  en: {
    yes_no: "Yes / No",
    minutes: "min",
    hours: "h",
    kilometers: "km",
    meters: "m",
    glasses: "glasses",
    sets: "sets",
    reps: "reps",
    times: "times",
    pages: "pages",
    healthy_meals: "meals",
    text: "text"
  },
  pt: {
    yes_no: "Sim / Nao",
    minutes: "min",
    hours: "h",
    kilometers: "km",
    meters: "m",
    glasses: "copos",
    sets: "series",
    reps: "rep",
    times: "vezes",
    pages: "paginas",
    healthy_meals: "refeicoes",
    text: "texto"
  },
  ja: {
    yes_no: "はい / いいえ",
    minutes: "分",
    hours: "時間",
    kilometers: "km",
    meters: "m",
    glasses: "杯",
    sets: "セット",
    reps: "回",
    times: "回",
    pages: "ページ",
    healthy_meals: "食",
    text: "テキスト"
  },
  ru: {
    yes_no: "Да / Нет",
    minutes: "мин",
    hours: "ч",
    kilometers: "км",
    meters: "м",
    glasses: "стак.",
    sets: "подходы",
    reps: "повт.",
    times: "раз",
    pages: "стр.",
    healthy_meals: "приемы пищи",
    text: "текст"
  },
  tr: {
    yes_no: "Evet / Hayir",
    minutes: "dk",
    hours: "sa",
    kilometers: "km",
    meters: "m",
    glasses: "bardak",
    sets: "set",
    reps: "tekrar",
    times: "kez",
    pages: "sayfa",
    healthy_meals: "ogun",
    text: "metin"
  }
};

const categoryLabels: Record<Locale, Record<Category, string>> = {
  es: {
    health: "Salud",
    creativity: "Creatividad",
    intelligence: "Inteligencia",
    discipline: "Disciplina",
    social: "Social",
    joy: "Alegria"
  },
  en: {
    health: "Health",
    creativity: "Creativity",
    intelligence: "Intelligence",
    discipline: "Discipline",
    social: "Social",
    joy: "Joy"
  },
  pt: {
    health: "Saude",
    creativity: "Criatividade",
    intelligence: "Inteligencia",
    discipline: "Disciplina",
    social: "Social",
    joy: "Alegria"
  },
  ja: {
    health: "健康",
    creativity: "創造性",
    intelligence: "知性",
    discipline: "規律",
    social: "交流",
    joy: "喜び"
  },
  ru: {
    health: "Здоровье",
    creativity: "Творчество",
    intelligence: "Интеллект",
    discipline: "Дисциплина",
    social: "Социальное",
    joy: "Радость"
  },
  tr: {
    health: "Saglik",
    creativity: "Yaraticilik",
    intelligence: "Zeka",
    discipline: "Disiplin",
    social: "Sosyal",
    joy: "Nese"
  }
};

const activityCopy: Record<string, Partial<Record<Locale, { name: string; description?: string }>>> = {
  caminar: {
    en: { name: "Walk" },
    pt: { name: "Caminhar" }
  },
  dibujar: {
    en: { name: "Draw" },
    pt: { name: "Desenhar" }
  },
  programar: {
    en: { name: "Code" },
    pt: { name: "Programar" }
  },
  agua: {
    en: { name: "Drink water" },
    pt: { name: "Beber agua" }
  },
  "comer-saludable": {
    en: { name: "Eat healthy" },
    pt: { name: "Comer saudavel" }
  },
  ejercicio: {
    en: { name: "Exercise" },
    pt: { name: "Exercicio" }
  },
  leer: {
    en: { name: "Read" },
    pt: { name: "Ler" }
  },
  "estudiar-algo": {
    en: { name: "Study something", description: "Learn a little, even just one idea." },
    pt: { name: "Estudar algo", description: "Aprender um pouquinho, mesmo que seja uma ideia." }
  },
  "aprender-idioma": {
    en: { name: "Learn a language", description: "Practice words, listening, or a short lesson." },
    pt: { name: "Aprender idioma", description: "Praticar palavras, escuta ou uma licao curta." }
  },
  banarse: {
    en: { name: "Shower", description: "A pause to reset your body." },
    pt: { name: "Tomar banho", description: "Uma pausa para resetar o corpo." }
  },
  "lavar-ropa": {
    en: { name: "Do laundry", description: "Get one load moving." },
    pt: { name: "Lavar roupa", description: "Deixar uma lavagem encaminhada." }
  },
  "jugar-un-juego": {
    en: { name: "Play a game", description: "A bit of play can recharge too." },
    pt: { name: "Jogar um jogo", description: "Um tempo de jogo tambem pode recarregar." }
  },
  sociabilizar: {
    en: { name: "Socialize", description: "A message, a talk, or sharing a moment." },
    pt: { name: "Socializar", description: "Uma mensagem, uma conversa ou compartilhar um momento." }
  },
  "ordenar-casa": {
    en: { name: "Tidy up", description: "Make the space feel a little lighter." },
    pt: { name: "Organizar", description: "Deixar o espaco um pouquinho mais leve." }
  },
  "planificar-semana": {
    en: { name: "Plan the week", description: "Choose priorities and prepare a lighter week." },
    pt: { name: "Planejar a semana", description: "Escolher prioridades e preparar uma semana mais leve." }
  },
  "revisar-metas-mes": {
    en: { name: "Review my monthly goals", description: "Look back at the journey and choose what to care for next month." },
    pt: { name: "Revisar minhas metas do mes", description: "Olhar o caminho percorrido e escolher o que cuidar no proximo mes." }
  }
};

const extraActivityCopy: Partial<Record<Locale, Record<string, { name: string; description?: string }>>> = {
  ja: {
    caminar: { name: "歩く" },
    dibujar: { name: "描く" },
    programar: { name: "プログラミング" },
    agua: { name: "水を飲む" },
    "comer-saludable": { name: "健康的に食べる" },
    ejercicio: { name: "運動" },
    leer: { name: "読書" },
    "estudiar-algo": { name: "何かを学ぶ", description: "少しだけでも、新しい考えを学ぶ。" },
    "aprender-idioma": { name: "言語を学ぶ", description: "単語、リスニング、短いレッスンを練習する。" },
    banarse: { name: "シャワー", description: "体をリセットするための休憩。" },
    "lavar-ropa": { name: "洗濯", description: "一回分の洗濯を進める。" },
    "jugar-un-juego": { name: "ゲームをする", description: "少し遊ぶことも回復になります。" },
    sociabilizar: { name: "交流する", description: "メッセージ、会話、ひとときを共有する。" },
    "ordenar-casa": { name: "片付け", description: "空間を少し軽くする。" }
  },
  ru: {
    caminar: { name: "Ходьба" },
    dibujar: { name: "Рисовать" },
    programar: { name: "Программировать" },
    agua: { name: "Пить воду" },
    "comer-saludable": { name: "Питаться полезно" },
    ejercicio: { name: "Тренировка" },
    leer: { name: "Читать" },
    "estudiar-algo": { name: "Изучить что-то", description: "Узнать немного, хотя бы одну идею." },
    "aprender-idioma": { name: "Учить язык", description: "Практиковать слова, аудирование или короткий урок." },
    banarse: { name: "Душ", description: "Пауза, чтобы перезагрузить тело." },
    "lavar-ropa": { name: "Постирать одежду", description: "Запустить одну стирку." },
    "jugar-un-juego": { name: "Поиграть", description: "Немного игры тоже может восстановить силы." },
    sociabilizar: { name: "Общаться", description: "Сообщение, разговор или общий момент." },
    "ordenar-casa": { name: "Убраться", description: "Сделать пространство немного легче." }
  },
  tr: {
    caminar: { name: "Yurumek" },
    dibujar: { name: "Cizmek" },
    programar: { name: "Kod yazmak" },
    agua: { name: "Su icmek" },
    "comer-saludable": { name: "Saglikli yemek" },
    ejercicio: { name: "Egzersiz" },
    leer: { name: "Okumak" },
    "estudiar-algo": { name: "Bir sey calismak", description: "Az da olsa yeni bir fikir ogrenmek." },
    "aprender-idioma": { name: "Dil ogrenmek", description: "Kelimeler, dinleme veya kisa bir ders pratigi." },
    banarse: { name: "Dus almak", description: "Bedeni sifirlamak icin kisa bir mola." },
    "lavar-ropa": { name: "Camasir yikamak", description: "Bir yikama baslatmak." },
    "jugar-un-juego": { name: "Oyun oynamak", description: "Biraz oyun da enerji verebilir." },
    sociabilizar: { name: "Sosyallesmek", description: "Bir mesaj, sohbet veya an paylasmak." },
    "ordenar-casa": { name: "Toparlamak", description: "Alani biraz daha hafifletmek." }
  }
};

const shopItemCopy: Record<string, Partial<Record<Locale, { name: string; description: string }>>> = {
  "gorro-papel": {
    en: { name: "Paper hat", description: "Simple, light, and ready to begin." },
    pt: { name: "Chapeu de papel", description: "Simples, leve e com vontade de comecar." }
  },
  "capa-papel": {
    en: { name: "Paper cape", description: "A first layer for a calm adventure." },
    pt: { name: "Capa de papel", description: "Primeiro abrigo de uma aventura tranquila." }
  },
  "mochila-papel": {
    en: { name: "Paper backpack", description: "Keeps tiny promises safe." },
    pt: { name: "Mochila de papel", description: "Guarda promessas pequenas." }
  },
  "mascota-bichito-papel": {
    en: { name: "Paper tiny buddy", description: "Small, calm, and always nearby." },
    pt: { name: "Bichinho de papel", description: "Pequeno, tranquilo e sempre perto." }
  },
  "armadura-carton": {
    en: { name: "Cardboard armor", description: "Light, sweet, and not intimidating at all." },
    pt: { name: "Armadura de papelao", description: "Leve, fofa e nada intimidadora." }
  },
  "escudo-carton": {
    en: { name: "Cardboard shield", description: "For protecting your rhythm." },
    pt: { name: "Escudo de papelao", description: "Para cuidar do seu ritmo." }
  },
  "mascota-cajita": {
    en: { name: "Little box companion", description: "A companion shaped like a tiny box." },
    pt: { name: "Companheiro caixinha", description: "Uma caixinha companheira." }
  },
  "mascota-caracol": {
    en: { name: "Patient snail", description: "It goes slowly, but it goes." },
    pt: { name: "Caracol paciente", description: "Vai devagar, mas vai." }
  },
  "sombrero-paja": {
    en: { name: "Straw hat", description: "Kind shade for bright days." },
    pt: { name: "Chapeu de palha", description: "Sombra gentil para dias claros." }
  },
  "capa-paja": {
    en: { name: "Straw cape", description: "A little scratchy, very supportive." },
    pt: { name: "Capa de palha", description: "Arranha um pouco, acompanha bastante." }
  },
  "fondo-campo": {
    en: { name: "Field background", description: "A soft field to breathe in." },
    pt: { name: "Fundo campo", description: "Um campo suave para respirar." }
  },
  "mascota-polillita": {
    en: { name: "Straw moth", description: "Flutters softly when you complete something." },
    pt: { name: "Mariposinha de palha", description: "Voa suave quando voce completa algo." }
  },
  "gorro-hoja": {
    en: { name: "Leaf hat", description: "A fresh little leaf for going outside." },
    pt: { name: "Chapeu de folha", description: "Uma folhinha fresca para sair ao mundo." }
  },
  "capa-musgo": {
    en: { name: "Moss cape", description: "Soft like a green rest." },
    pt: { name: "Capa de musgo", description: "Suave como um descanso verde." }
  },
  "fondo-bosque": {
    en: { name: "Forest background", description: "A green corner for resting." },
    pt: { name: "Fundo bosque", description: "Um canto verde para descansar." }
  },
  "mascota-brote": {
    en: { name: "Walking sprout", description: "A little plant that learned to keep you company." },
    pt: { name: "Broto caminhante", description: "Uma plantinha que aprendeu a acompanhar." }
  },
  "botas-goma": {
    en: { name: "Rubber boots", description: "For moving forward even when the path feels strange." },
    pt: { name: "Botas de borracha", description: "Para avancar mesmo quando o caminho esta estranho." }
  },
  "traje-comfy": {
    en: { name: "Comfy outfit", description: "Clothes for returning slowly." },
    pt: { name: "Roupa comfy", description: "Roupa para voltar devagar." }
  },
  "auriculares-nube": {
    en: { name: "Cloud headphones", description: "For listening to something that feels kind." },
    pt: { name: "Fones nuvem", description: "Para ouvir algo que abraca." }
  },
  "mascota-slime": {
    en: { name: "Soft slime", description: "Bounces without rushing anyone." },
    pt: { name: "Slime macio", description: "Pula sem apressar ninguem." }
  },
  "espada-madera": {
    en: { name: "Wooden sword", description: "For clearing imaginary weeds." },
    pt: { name: "Espada de madeira", description: "Para cortar matos imaginarios." }
  },
  "mochila-simple": {
    en: { name: "Wooden backpack", description: "Keeps your steps and your motivation." },
    pt: { name: "Mochila de madeira", description: "Guarda seus passos e sua vontade." }
  },
  "varita-madera": {
    en: { name: "Wooden wand", description: "A reminder that creating counts too." },
    pt: { name: "Varinha de madeira", description: "Para lembrar que criar tambem conta." }
  },
  "mascota-zorrito": {
    en: { name: "Wooden fox", description: "Curious, calm, and very companionable." },
    pt: { name: "Raposa de madeira", description: "Curiosa, calma e muito companheira." }
  },
  "gorra-chapa": {
    en: { name: "Sheet metal cap", description: "Shines a little, protects a lot." },
    pt: { name: "Bone de chapa", description: "Brilha pouco, protege bastante." }
  },
  "capa-chapa": {
    en: { name: "Light sheet metal cape", description: "A steady upgrade without becoming heavy." },
    pt: { name: "Capa leve de chapa", description: "Uma melhora firme sem ficar pesada." }
  },
  "fondo-taller": {
    en: { name: "Workshop background", description: "A place to repair things little by little." },
    pt: { name: "Fundo oficina", description: "Um lugar para arrumar aos poucos." }
  },
  "mascota-tortuga": {
    en: { name: "Sheet metal turtle", description: "Steady and slow, like a good streak." },
    pt: { name: "Tartaruga de chapa", description: "Firme e lenta, como uma boa sequencia." }
  },
  "casco-metal": {
    en: { name: "Soft metal helmet", description: "Strong, round, and not aggressive." },
    pt: { name: "Capacete de metal suave", description: "Firme, redondo e nada agressivo." }
  },
  "mochila-metal": {
    en: { name: "Light metal backpack", description: "For carrying resources without rushing." },
    pt: { name: "Mochila de metal leve", description: "Para carregar recursos sem pressa." }
  },
  "mascota-robotito": {
    en: { name: "Little robot companion", description: "Makes a quiet beep when you keep going." },
    pt: { name: "Robo companheiro", description: "Faz bip baixinho quando voce continua." }
  },
  "corona-oro": {
    en: { name: "Warm gold crown", description: "It does not command: it celebrates." },
    pt: { name: "Coroa de ouro morno", description: "Nao manda: celebra." }
  },
  "capa-estrella": {
    en: { name: "Golden star cape", description: "Shines without rushing you." },
    pt: { name: "Capa estrela dourada", description: "Brilha sem te apressar." }
  },
  "fondo-sol": {
    en: { name: "Golden sun background", description: "A sunrise earned with patience." },
    pt: { name: "Fundo sol dourado", description: "Um amanhecer ganho com paciencia." }
  },
  "mascota-ciervo-sol": {
    en: { name: "Solar deer", description: "Big, serene, and bright." },
    pt: { name: "Cervo solar", description: "Grande, sereno e luminoso." }
  },
  "amuleto-rubi": {
    en: { name: "Ruby amulet", description: "Keeps a spark of consistency." },
    pt: { name: "Amuleto rubi", description: "Guarda uma faisca de constancia." }
  },
  "capa-rubi": {
    en: { name: "Ruby cape", description: "For when returning is already part of you." },
    pt: { name: "Capa rubi", description: "Para quando voltar ja faz parte de voce." }
  },
  "mascota-rubi": {
    en: { name: "Calm ruby dragon", description: "Huge, mythical, and surprisingly cuddly." },
    pt: { name: "Dragao rubi tranquilo", description: "Gigante, mitologico e surpreendentemente carinhoso." }
  },
  "mascota-ballena-celeste": {
    en: { name: "Sky blue whale", description: "Floats slowly and protects the quiet." },
    pt: { name: "Baleia celeste", description: "Flutua devagar e cuida do silencio." }
  },
  "buso-capucha": {
    en: { name: "Hoodie", description: "Your own hoodie for slow-return days." },
    pt: { name: "Moletom com capuz", description: "Um moletom proprio para dias de voltar devagar." }
  },
  "auriculares-calle": {
    en: { name: "Street headphones", description: "Music for walking at your pace." },
    pt: { name: "Fones de rua", description: "Musica para caminhar no seu ritmo." }
  },
  "tattoos-suaves": {
    en: { name: "Temporary tattoos", description: "Aesthetic little marks, no commitment." },
    pt: { name: "Tattoos temporarias", description: "Marquinhas esteticas, sem compromisso." }
  },
  "cuernos-diablito": {
    en: { name: "Playful little horns", description: "Soft mischief, zero malice." },
    pt: { name: "Chifrinhos travessos", description: "Travessura fofa, zero maldade." }
  },
  "corona-angel": {
    en: { name: "Angel crown", description: "Soft light for when you treated yourself well." },
    pt: { name: "Coroa de anjo", description: "Luz suave para quando voce se tratou bem." }
  },
  "headphones-pro": {
    en: { name: "Headphones pro", description: "For focus mode without leaving the world." },
    pt: { name: "Headphones pro", description: "Para entrar em modo foco sem se isolar do mundo." }
  },
  "pinturas-esteticas": {
    en: { name: "Aesthetic paints", description: "Colors for turning the day into something yours." },
    pt: { name: "Tintas esteticas", description: "Cores para transformar o dia em algo seu." }
  },
  "alas-angel": {
    en: { name: "Angel wings", description: "Clear wings for lifting your mood." },
    pt: { name: "Asas de anjo", description: "Asas claras para levantar o animo." }
  },
  "alas-demonio": {
    en: { name: "Cute demon wings", description: "Dramatic, soft, and pretty stylish." },
    pt: { name: "Asas de demonio cute", description: "Dramaticas, suaves e bem estilosas." }
  },
  "skate-suave": {
    en: { name: "Gentle skate", description: "For gliding without rushing." },
    pt: { name: "Skate suave", description: "Para deslizar sem pressa." }
  },
  "patines-nube": {
    en: { name: "Cloud skates", description: "Light wheels for better days." },
    pt: { name: "Patins nuvem", description: "Rodinhas leves para dias melhores." }
  },
  "notebook-stickers": {
    en: { name: "Laptop with stickers", description: "Your portable station for coding, writing, or creating." },
    pt: { name: "Notebook com stickers", description: "Sua estacao portatil para programar, escrever ou criar." }
  }
};

const shopTypeLabels: Record<Locale, Record<ShopItem["type"], string>> = {
  es: {
    head: "gorro",
    body: "ropa",
    accessory: "accesorio",
    backpack: "mochila",
    weapon: "herramienta",
    pet: "mascota",
    background: "fondo"
  },
  en: {
    head: "hat",
    body: "outfit",
    accessory: "accessory",
    backpack: "backpack",
    weapon: "tool",
    pet: "companion",
    background: "background"
  },
  pt: {
    head: "chapeu",
    body: "roupa",
    accessory: "acessorio",
    backpack: "mochila",
    weapon: "ferramenta",
    pet: "mascote",
    background: "fundo"
  },
  ja: {
    head: "帽子",
    body: "服",
    accessory: "アクセサリー",
    backpack: "バックパック",
    weapon: "道具",
    pet: "仲間",
    background: "背景"
  },
  ru: {
    head: "головной убор",
    body: "одежда",
    accessory: "аксессуар",
    backpack: "рюкзак",
    weapon: "инструмент",
    pet: "спутник",
    background: "фон"
  },
  tr: {
    head: "sapka",
    body: "kiyafet",
    accessory: "aksesuar",
    backpack: "sirt cantasi",
    weapon: "arac",
    pet: "yoldas",
    background: "arka plan"
  }
};

const genericShopDescription: Record<Locale, string> = {
  es: "Un objeto amable para acompanar tu progreso.",
  en: "A gentle item to accompany your progress.",
  pt: "Um item gentil para acompanhar seu progresso.",
  ja: "あなたの進捗に寄り添うやさしいアイテムです。",
  ru: "Добрый предмет, который сопровождает твой прогресс.",
  tr: "Ilerlemeni destekleyen nazik bir esya."
};

const materialLabels: Record<Locale, Record<string, string>> = {
  es: {
    papel: "papel",
    carton: "carton",
    paja: "paja",
    planta: "planta",
    goma: "goma",
    madera: "madera",
    chapa: "chapa",
    metal: "metal",
    oro: "oro",
    rubi: "rubi",
    especial: "especial"
  },
  en: {
    papel: "paper",
    carton: "cardboard",
    paja: "straw",
    planta: "plant",
    goma: "rubber",
    madera: "wood",
    chapa: "sheet metal",
    metal: "metal",
    oro: "gold",
    rubi: "ruby",
    especial: "special"
  },
  pt: {
    papel: "papel",
    carton: "papelao",
    paja: "palha",
    planta: "planta",
    goma: "borracha",
    madera: "madeira",
    chapa: "chapa",
    metal: "metal",
    oro: "ouro",
    rubi: "rubi",
    especial: "especial"
  },
  ja: {
    papel: "紙",
    carton: "段ボール",
    paja: "わら",
    planta: "植物",
    goma: "ゴム",
    madera: "木",
    chapa: "板金",
    metal: "金属",
    oro: "金",
    rubi: "ルビー",
    especial: "特別"
  },
  ru: {
    papel: "бумага",
    carton: "картон",
    paja: "солома",
    planta: "растение",
    goma: "резина",
    madera: "дерево",
    chapa: "листовой металл",
    metal: "металл",
    oro: "золото",
    rubi: "рубин",
    especial: "особое"
  },
  tr: {
    papel: "kagit",
    carton: "karton",
    paja: "saman",
    planta: "bitki",
    goma: "lastik",
    madera: "ahsap",
    chapa: "sac",
    metal: "metal",
    oro: "altin",
    rubi: "yakut",
    especial: "ozel"
  }
};

const worldMessages: Record<Locale, string[]> = {
  es: [
    "Tu constancia construye este lugar.",
    "Cada paso que das aparece en tu mundo.",
    "No hace falta hacerlo perfecto. Solo volver."
  ],
  en: [
    "Your consistency builds this place.",
    "Every step you take appears in your world.",
    "It does not need to be perfect. Just return."
  ],
  pt: [
    "Sua constancia constroi este lugar.",
    "Cada passo que voce da aparece no seu mundo.",
    "Nao precisa ser perfeito. So voltar."
  ],
  ja: [
    "あなたの継続がこの場所を育てます。",
    "踏み出す一歩が、あなたの世界に現れます。",
    "完璧でなくていい。ただ戻ってくればいい。"
  ],
  ru: [
    "Твоя регулярность строит это место.",
    "Каждый твой шаг появляется в твоем мире.",
    "Не нужно идеально. Важно возвращаться."
  ],
  tr: [
    "Istikrarin bu yeri kuruyor.",
    "Attigin her adim dunyana yansiyor.",
    "Mukemmel olmak zorunda degil. Sadece geri don."
  ]
};

const worldZoneCopy: Record<string, Record<Locale, { name: string; category: string; details: string[]; message: string; sceneLabel: string }>> = {
  lake: {
    es: { name: "Lago", category: "Salud", details: ["tierra seca", "charquito", "laguito", "lago con flores", "lago con patitos", "lago magico"], message: "Cada vaso llena un poco este lugar.", sceneLabel: "Laguito" },
    en: { name: "Lake", category: "Health", details: ["dry land", "little puddle", "small lake", "lake with flowers", "lake with ducks", "magic lake"], message: "Every glass fills this place a little.", sceneLabel: "Small lake" },
    pt: { name: "Lago", category: "Saude", details: ["terra seca", "pocinha", "laguinho", "lago com flores", "lago com patos", "lago magico"], message: "Cada copo enche um pouco este lugar.", sceneLabel: "Laguinho" },
    ja: { name: "湖", category: "健康", details: ["乾いた土地", "小さな水たまり", "小さな湖", "花のある湖", "アヒルのいる湖", "魔法の湖"], message: "一杯の水が、この場所を少しずつ満たします。", sceneLabel: "小さな湖" },
    ru: { name: "Озеро", category: "Здоровье", details: ["сухая земля", "лужица", "маленькое озеро", "озеро с цветами", "озеро с утками", "волшебное озеро"], message: "Каждый стакан немного наполняет это место.", sceneLabel: "Озеро" },
    tr: { name: "Gol", category: "Saglik", details: ["kuru toprak", "kucuk su birikintisi", "kucuk gol", "cicekli gol", "ordekli gol", "sihirli gol"], message: "Her bardak bu yeri biraz doldurur.", sceneLabel: "Kucuk gol" }
  },
  path: {
    es: { name: "Sendero", category: "Movimiento", details: ["sin camino", "caminito corto", "camino con piedras", "camino con flores", "camino con carteles", "camino hacia la colina"], message: "Cada paso que das aparece en tu mundo.", sceneLabel: "Sendero" },
    en: { name: "Path", category: "Movement", details: ["no path", "short path", "stone path", "flower path", "path with signs", "path to the hill"], message: "Every step you take appears in your world.", sceneLabel: "Path" },
    pt: { name: "Trilha", category: "Movimento", details: ["sem caminho", "caminho curto", "caminho com pedras", "caminho com flores", "caminho com placas", "caminho ate a colina"], message: "Cada passo que voce da aparece no seu mundo.", sceneLabel: "Trilha" },
    ja: { name: "小道", category: "運動", details: ["道なし", "短い小道", "石の小道", "花の小道", "看板のある小道", "丘へ向かう道"], message: "あなたの一歩一歩が世界に現れます。", sceneLabel: "小道" },
    ru: { name: "Тропа", category: "Движение", details: ["нет пути", "короткая тропа", "каменная тропа", "тропа с цветами", "тропа с указателями", "тропа к холму"], message: "Каждый твой шаг появляется в твоем мире.", sceneLabel: "Тропа" },
    tr: { name: "Patika", category: "Hareket", details: ["yol yok", "kisa patika", "tasli patika", "cicekli patika", "tabelali patika", "tepeye giden yol"], message: "Attigin her adim dunyanda belirir.", sceneLabel: "Patika" }
  },
  creative: {
    es: { name: "Taller creativo", category: "Creatividad", details: ["sin taller", "mesa con lapiz", "caballete", "taller pequeno", "taller con cuadros", "casita estudio"], message: "Crear tambien es cuidarte.", sceneLabel: "Taller creativo" },
    en: { name: "Creative studio", category: "Creativity", details: ["no studio", "desk with pencil", "easel", "small studio", "studio with paintings", "study cottage"], message: "Creating is also caring for yourself.", sceneLabel: "Creative studio" },
    pt: { name: "Atelie criativo", category: "Criatividade", details: ["sem atelie", "mesa com lapis", "cavalete", "atelie pequeno", "atelie com quadros", "casinha estudio"], message: "Criar tambem e se cuidar.", sceneLabel: "Atelie criativo" },
    ja: { name: "創作スタジオ", category: "創造性", details: ["スタジオなし", "鉛筆のある机", "イーゼル", "小さなスタジオ", "絵のあるスタジオ", "学びの小屋"], message: "創ることも、自分を大切にすることです。", sceneLabel: "創作スタジオ" },
    ru: { name: "Творческая мастерская", category: "Творчество", details: ["нет мастерской", "стол с карандашом", "мольберт", "маленькая мастерская", "мастерская с картинами", "домик-студия"], message: "Создавать тоже значит заботиться о себе.", sceneLabel: "Мастерская" },
    tr: { name: "Yaratici atolye", category: "Yaraticilik", details: ["atolye yok", "kalemli masa", "sovale", "kucuk atolye", "tablolu atolye", "studyo evi"], message: "Uretmek de kendine bakmaktir.", sceneLabel: "Yaratici atolye" }
  },
  tech: {
    es: { name: "Taller calido", category: "Foco", details: ["sin mesa", "mesita simple", "mesa con herramientas", "taller artesanal", "casita tecnica", "refugio de ideas"], message: "Programar arma una casita de calma.", sceneLabel: "Taller calido" },
    en: { name: "Warm workshop", category: "Focus", details: ["no desk", "simple desk", "desk with tools", "craft workshop", "tech cottage", "idea shelter"], message: "Coding builds a little house of calm.", sceneLabel: "Warm workshop" },
    pt: { name: "Oficina calma", category: "Foco", details: ["sem mesa", "mesinha simples", "mesa com ferramentas", "oficina artesanal", "casinha tecnica", "refugio de ideias"], message: "Programar monta uma casinha de calma.", sceneLabel: "Oficina calma" },
    ja: { name: "あたたかい工房", category: "集中", details: ["机なし", "シンプルな机", "道具のある机", "手作り工房", "技術の小屋", "アイデアの避難所"], message: "プログラミングは静かな小屋を作ります。", sceneLabel: "工房" },
    ru: { name: "Теплая мастерская", category: "Фокус", details: ["нет стола", "простой столик", "стол с инструментами", "ручная мастерская", "технический домик", "убежище идей"], message: "Программирование строит домик спокойствия.", sceneLabel: "Мастерская" },
    tr: { name: "Sicak atolye", category: "Odak", details: ["masa yok", "sade masa", "aletli masa", "el isi atolye", "teknik ev", "fikir siginagi"], message: "Kod yazmak sakin bir ev kurar.", sceneLabel: "Sicak atolye" }
  },
  library: {
    es: { name: "Biblioteca", category: "Aprendizaje", details: ["sin biblioteca", "estante pequeno", "biblioteca nivel 2", "rincon de estudio", "biblioteca amplia", "biblioteca luminosa"], message: "Aprender suma ventanas nuevas.", sceneLabel: "Biblioteca" },
    en: { name: "Library", category: "Learning", details: ["no library", "small shelf", "level 2 library", "study corner", "wide library", "bright library"], message: "Learning adds new windows.", sceneLabel: "Library" },
    pt: { name: "Biblioteca", category: "Aprendizado", details: ["sem biblioteca", "estante pequena", "biblioteca nivel 2", "canto de estudo", "biblioteca ampla", "biblioteca luminosa"], message: "Aprender soma janelas novas.", sceneLabel: "Biblioteca" },
    ja: { name: "図書館", category: "学び", details: ["図書館なし", "小さな棚", "レベル2の図書館", "学習コーナー", "広い図書館", "明るい図書館"], message: "学ぶことで、新しい窓が増えます。", sceneLabel: "図書館" },
    ru: { name: "Библиотека", category: "Обучение", details: ["нет библиотеки", "маленькая полка", "библиотека уровня 2", "учебный уголок", "просторная библиотека", "светлая библиотека"], message: "Учеба добавляет новые окна.", sceneLabel: "Библиотека" },
    tr: { name: "Kutuphane", category: "Ogrenme", details: ["kutuphane yok", "kucuk raf", "seviye 2 kutuphane", "calisma kosesi", "genis kutuphane", "isikli kutuphane"], message: "Ogrenmek yeni pencereler acar.", sceneLabel: "Kutuphane" }
  },
  gym: {
    es: { name: "Gimnasio suave", category: "Energia", details: ["sin zona", "esterilla", "pesas suaves", "banco de madera", "zona completa", "patio de entrenamiento"], message: "Tu cuerpo tambien construye el paisaje.", sceneLabel: "Gimnasio suave" },
    en: { name: "Gentle gym", category: "Energy", details: ["no zone", "mat", "light weights", "wooden bench", "complete zone", "training yard"], message: "Your body builds the landscape too.", sceneLabel: "Gentle gym" },
    pt: { name: "Academia leve", category: "Energia", details: ["sem zona", "tapete", "pesos leves", "banco de madeira", "zona completa", "patio de treino"], message: "Seu corpo tambem constroi a paisagem.", sceneLabel: "Academia leve" },
    ja: { name: "やさしいジム", category: "エネルギー", details: ["エリアなし", "マット", "軽い重り", "木のベンチ", "完成したエリア", "トレーニング庭"], message: "体も景色を作っています。", sceneLabel: "やさしいジム" },
    ru: { name: "Мягкий зал", category: "Энергия", details: ["нет зоны", "коврик", "легкие веса", "деревянная скамья", "полная зона", "двор для тренировок"], message: "Твое тело тоже строит пейзаж.", sceneLabel: "Зал" },
    tr: { name: "Hafif spor alani", category: "Enerji", details: ["alan yok", "mat", "hafif agirliklar", "ahsap bank", "tam alan", "antrenman avlusu"], message: "Bedenin de manzarayi kurar.", sceneLabel: "Spor alani" }
  },
  garden: {
    es: { name: "Huerta", category: "Nutricion", details: ["sin huerta", "brote", "canasta", "huerta pequena", "mesa sana", "huerta abundante"], message: "Comer bien hace crecer la tierra.", sceneLabel: "Huerta" },
    en: { name: "Garden", category: "Nutrition", details: ["no garden", "sprout", "basket", "small garden", "healthy table", "abundant garden"], message: "Eating well makes the land grow.", sceneLabel: "Garden" },
    pt: { name: "Horta", category: "Nutricao", details: ["sem horta", "broto", "cesta", "horta pequena", "mesa saudavel", "horta abundante"], message: "Comer bem faz a terra crescer.", sceneLabel: "Horta" },
    ja: { name: "菜園", category: "栄養", details: ["菜園なし", "芽", "かご", "小さな菜園", "健康的な食卓", "豊かな菜園"], message: "よく食べることは、土地を育てます。", sceneLabel: "菜園" },
    ru: { name: "Огород", category: "Питание", details: ["нет огорода", "росток", "корзина", "маленький огород", "здоровый стол", "обильный огород"], message: "Хорошая еда помогает земле расти.", sceneLabel: "Огород" },
    tr: { name: "Bahce", category: "Beslenme", details: ["bahce yok", "filiz", "sepet", "kucuk bahce", "saglikli masa", "bereketli bahce"], message: "Iyi yemek toprağı buyutur.", sceneLabel: "Bahce" }
  },
  social: {
    es: { name: "Plaza social", category: "Vinculos", details: ["sin plaza", "banquito", "plaza pequena", "fogata tranquila", "plaza con visitas", "plaza de encuentros"], message: "Un contacto amable tambien cuenta.", sceneLabel: "Plaza social" },
    en: { name: "Social square", category: "Bonds", details: ["no square", "small bench", "small square", "quiet fire", "square with visits", "meeting square"], message: "A kind contact counts too.", sceneLabel: "Social square" },
    pt: { name: "Praca social", category: "Vinculos", details: ["sem praca", "banquinho", "praca pequena", "fogueira tranquila", "praca com visitas", "praca de encontros"], message: "Um contato gentil tambem conta.", sceneLabel: "Praca social" },
    ja: { name: "交流広場", category: "つながり", details: ["広場なし", "小さなベンチ", "小さな広場", "静かな焚き火", "訪問者のいる広場", "出会いの広場"], message: "やさしい連絡も大切です。", sceneLabel: "交流広場" },
    ru: { name: "Социальная площадь", category: "Связи", details: ["нет площади", "скамейка", "маленькая площадь", "тихий костер", "площадь с гостями", "площадь встреч"], message: "Добрый контакт тоже считается.", sceneLabel: "Площадь" },
    tr: { name: "Sosyal meydan", category: "Baglar", details: ["meydan yok", "bank", "kucuk meydan", "sessiz ates", "ziyaretcili meydan", "bulusma meydani"], message: "Nazik bir temas da sayilir.", sceneLabel: "Sosyal meydan" }
  },
  rest: {
    es: { name: "Zona comfy", category: "Descanso", details: ["sin rincon", "almohadon", "mantita", "hamaca", "fogata tranquila", "nube de descanso"], message: "Descansar tambien es parte del camino.", sceneLabel: "Zona comfy" },
    en: { name: "Comfy zone", category: "Rest", details: ["no corner", "cushion", "soft blanket", "hammock", "quiet fire", "rest cloud"], message: "Resting is part of the path too.", sceneLabel: "Comfy zone" },
    pt: { name: "Zona comfy", category: "Descanso", details: ["sem canto", "almofada", "mantinha", "rede", "fogueira tranquila", "nuvem de descanso"], message: "Descansar tambem faz parte do caminho.", sceneLabel: "Zona comfy" },
    ja: { name: "くつろぎエリア", category: "休息", details: ["場所なし", "クッション", "小さな毛布", "ハンモック", "静かな焚き火", "休息の雲"], message: "休むことも道の一部です。", sceneLabel: "くつろぎ" },
    ru: { name: "Уютная зона", category: "Отдых", details: ["нет уголка", "подушка", "плед", "гамак", "тихий костер", "облако отдыха"], message: "Отдых тоже часть пути.", sceneLabel: "Уютная зона" },
    tr: { name: "Rahat alan", category: "Dinlenme", details: ["kose yok", "minder", "battaniye", "hamak", "sessiz ates", "dinlenme bulutu"], message: "Dinlenmek de yolun bir parcasidir.", sceneLabel: "Rahat alan" }
  }
};

const viewLabelKeys: Record<string, CopyKey> = {
  today: "viewToday",
  week: "viewWeek",
  month: "viewMonth",
  world: "viewWorld",
  avatar: "viewAvatar",
  stats: "viewStats",
  shop: "viewShop",
  new: "viewNew",
  friends: "viewFriends"
};

export function getViewLabel(locale: Locale, view: string) {
  return t(locale, viewLabelKeys[view] ?? "viewToday");
}

export function getUnitLabel(locale: Locale, unit: ActivityUnit) {
  return unitLabels[locale][unit] ?? unitLabels.es[unit];
}

export function getCategoryLabel(locale: Locale, category: Category) {
  return categoryLabels[locale][category] ?? categoryLabels.es[category];
}

export function getActivityName(locale: Locale, activity: Activity) {
  return extraActivityCopy[locale]?.[activity.id]?.name ?? activityCopy[activity.id]?.[locale]?.name ?? activity.name;
}

export function getActivityTargetLabel(locale: Locale, activity: Activity) {
  if (activity.unit === "yes_no") return getUnitLabel(locale, activity.unit);
  if (activity.targetValue) return `${activity.targetValue} ${getUnitLabel(locale, activity.unit)}`;
  return activity.targetLabel ?? "";
}

export function getMaterialLabel(locale: Locale, material: string) {
  return materialLabels[locale][material] ?? materialLabels.es[material] ?? material;
}

export function getShopItemName(locale: Locale, item: ShopItem) {
  const translated = shopItemCopy[item.id]?.[locale]?.name;
  if (translated) return translated;
  if (locale === "es") return item.name;
  const material = getMaterialLabel(locale, item.material ?? "especial");
  const type = shopTypeLabels[locale][item.type];
  return locale === "ja" ? `${material}${type}` : `${material} ${type}`;
}

export function getShopItemDescription(locale: Locale, item: ShopItem) {
  return shopItemCopy[item.id]?.[locale]?.description ?? (locale === "es" ? item.description : genericShopDescription[locale]);
}

export function getWorldMessage(locale: Locale, index: number) {
  const messages = worldMessages[locale] ?? worldMessages.es;
  return messages[index % messages.length];
}

export function getWorldZoneText(locale: Locale, zoneId: string) {
  return worldZoneCopy[zoneId]?.[locale] ?? worldZoneCopy[zoneId]?.es;
}

export function getWorldZoneDetail(locale: Locale, zoneId: string, level: number, fallback: string) {
  const zone = getWorldZoneText(locale, zoneId);
  return zone?.details[level] ?? fallback;
}

export function getWeekdayHeaders(locale: Locale) {
  if (locale === "en") return ["M", "T", "W", "T", "F", "S", "S"];
  if (locale === "pt") return ["S", "T", "Q", "Q", "S", "S", "D"];
  if (locale === "ja") return ["月", "火", "水", "木", "金", "土", "日"];
  if (locale === "ru") return ["П", "В", "С", "Ч", "П", "С", "В"];
  if (locale === "tr") return ["P", "S", "Ç", "P", "C", "C", "P"];
  return ["L", "M", "M", "J", "V", "S", "D"];
}
