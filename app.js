const SAVE_KEY = "survive-life-v2";
const TICK_MS = 1000;
const DEFAULT_SPEED = 1;
const GAME_VERSION = "v0.29";

const DIFFICULTIES = {
  easy: { label: "Легко", startMoney: 20000 },
  normal: { label: "Базово", startMoney: 10000 },
  hard: { label: "Сложно", startMoney: 5000 },
};

const JOBS = {
  courier: { name: "Курьер", mode: "flex", stressPerHour: 18, baseHourly: 11, unlockRep: 0 },
  callcenter: { name: "Оператор колл-центра", mode: "fixed", stressPerHour: 12, baseHourly: 10, shift: "09:00–18:00, 5/2", unlockRep: 450 },
  warehouse: { name: "Помощник на складе", mode: "shift", stressPerHour: 16, baseHourly: 12, shift: "2/2 по 12ч", unlockRep: 520 },
  barista: { name: "Бариста", mode: "fixed", stressPerHour: 13, baseHourly: 11, shift: "08:00–17:00, 5/2", unlockRep: 420 },
  sales: { name: "Продавец-консультант", mode: "shift", stressPerHour: 15, baseHourly: 13, shift: "2/2 по 10ч", unlockRep: 560 },
  juniordev: { name: "Младший разработчик", mode: "fixed", stressPerHour: 20, baseHourly: 17, shift: "10:00–19:00, 5/2", unlockRep: 700 },
};

const SHOP_ITEMS = {
  groceries: [
    { id: "apple", name: "Яблоко", price: 2, satiety: 65, nutrition: 70, shelfDays: 6, fridgePreferred: false },
    { id: "milk", name: "Молоко", price: 3, satiety: 110, nutrition: 115, shelfDays: 3, fridgePreferred: true },
    { id: "bread", name: "Хлеб", price: 2, satiety: 140, nutrition: 120, shelfDays: 5, fridgePreferred: false },
    { id: "chicken", name: "Курица", price: 7, satiety: 210, nutrition: 170, shelfDays: 2, fridgePreferred: true },
    { id: "egg", name: "Яйца", price: 4, satiety: 160, nutrition: 150, shelfDays: 8, fridgePreferred: true },
    { id: "rice", name: "Рис", price: 3, satiety: 190, nutrition: 140, shelfDays: 12, fridgePreferred: false },
    { id: "potato", name: "Картофель", price: 3, satiety: 130, nutrition: 120, shelfDays: 9, fridgePreferred: false },
    { id: "tomato", name: "Помидоры", price: 3, satiety: 45, nutrition: 80, shelfDays: 5, fridgePreferred: true },
    { id: "cheese", name: "Сыр", price: 5, satiety: 210, nutrition: 190, shelfDays: 6, fridgePreferred: true },
  ],
  appliances: [
    { id: "fridge", name: "Холодильник", price: 2400, comfort: 70, powerPerHour: 0.05, durability: 1000 },
    { id: "dishwasher", name: "Посудомойка", price: 2900, comfort: 40, powerPerHour: 0.06, waterSave: 0.35, durability: 1000 },
    { id: "washer", name: "Стиральная машина", price: 3100, comfort: 50, powerPerHour: 0.07, durability: 1000 },
    { id: "coffee", name: "Кофе-машина", price: 1400, comfort: 25, moodBoost: 30, powerPerHour: 0.03, durability: 1000 },
    { id: "kettle", name: "Электрочайник", price: 800, comfort: 15, powerPerHour: 0.02, durability: 1000 },
    { id: "microwave", name: "Микроволновка", price: 1900, comfort: 22, powerPerHour: 0.05, durability: 1000 },
    { id: "stove", name: "Варочная поверхность", price: 2600, comfort: 28, powerPerHour: 0.06, durability: 1000 },
    { id: "vacuum", name: "Робот-пылесос", price: 3600, comfort: 58, powerPerHour: 0.04, durability: 1000 },
    { id: "airpurifier", name: "Очиститель воздуха", price: 2700, comfort: 35, powerPerHour: 0.03, durability: 1000 },
  ],
  home: [
    { id: "table", name: "Стол", price: 700, comfort: 35, durability: 1000 },
    { id: "chair", name: "Стул", price: 260, comfort: 15, durability: 1000 },
    { id: "armchair", name: "Кресло", price: 900, comfort: 45, durability: 1000 },
    { id: "lamp", name: "Торшер", price: 520, comfort: 20, powerPerHour: 0.02, durability: 1000 },
    { id: "shelf", name: "Стеллаж", price: 780, comfort: 28, durability: 1000 },
    { id: "curtains", name: "Шторы", price: 640, comfort: 18, durability: 1000 },
    { id: "carpet", name: "Ковёр", price: 1100, comfort: 33, durability: 1000 },
    { id: "dresser", name: "Комод", price: 1250, comfort: 30, durability: 1000 },
  ],
};

const COOKING_RECIPES = [
  { id: "omelette", name: "Омлет", ingredients: ["egg", "milk"], satiety: 180, nutrition: 160, minutes: 14, appliances: ["microwave", "stove"] },
  { id: "chickenRice", name: "Курица с рисом", ingredients: ["chicken", "rice"], satiety: 220, nutrition: 190, minutes: 24, appliances: ["stove"] },
  { id: "bakedPotato", name: "Запечённый картофель", ingredients: ["potato", "cheese"], satiety: 170, nutrition: 150, minutes: 18, appliances: ["microwave", "stove"] },
  { id: "vegSalad", name: "Овощной салат", ingredients: ["tomato", "cheese"], satiety: 130, nutrition: 170, minutes: 10, appliances: ["stove"] },
];

const LOCATIONS = [
  { id: "home", icon: "🏠", label: "Дом" },
  { id: "work", icon: "💼", label: "Работа" },
  { id: "shops", icon: "🛒", label: "Магазины" },
  { id: "utilities", icon: "🧾", label: "ЖКУ" },
  { id: "bank", icon: "🏦", label: "Банк" },
  { id: "jobs", icon: "📄", label: "Рынок труда" },
  { id: "clinic", icon: "🏥", label: "Медицина" },
  { id: "settings", icon: "🛠️", label: "Настройки" },
  { id: "admin", icon: "⚙️", label: "Админ" },
];

const WORLD_SCENES = {
  home: { eyebrow: "Тихий квартал · 14", title: "Моя квартира", subtitle: "Здесь можно восстановиться, приготовить еду и привести быт в порядок.", tone: "home", ambience: "За окном шуршит город. Дома спокойно." },
  work: { eyebrow: "Деловой центр", title: "Рабочее место", subtitle: "Смена, команда и следующая ступень карьеры — всё начинается здесь.", tone: "work", ambience: "Офис живёт в ритме уведомлений и дедлайнов." },
  shops: { eyebrow: "Торговая галерея", title: "Рынок у дома", subtitle: "Продукты, техника и вещи для пространства, в котором хочется жить.", tone: "shops", ambience: "Витрины светятся, а в воздухе пахнет свежим хлебом." },
  utilities: { eyebrow: "Городской сервис", title: "Центр услуг", subtitle: "Счета, показания и важные бытовые обязательства в одном месте.", tone: "utilities", ambience: "Электронная очередь движется удивительно быстро." },
  bank: { eyebrow: "Финансовый квартал", title: "Городской банк", subtitle: "Управляйте запасом денег, кредитом и долгосрочными планами.", tone: "bank", ambience: "В просторном зале тихо звучит музыка." },
  jobs: { eyebrow: "Проспект возможностей", title: "Карьерный центр", subtitle: "Сравните вакансии и выберите направление следующего этапа жизни.", tone: "jobs", ambience: "На стенде появляются новые предложения." },
  clinic: { eyebrow: "Медицинский кампус", title: "Клиника", subtitle: "Здоровье — ресурс, который стоит беречь до того, как он закончится.", tone: "clinic", ambience: "В холле светло и спокойно." },
  settings: { eyebrow: "Вне игрового мира", title: "Центр управления", subtitle: "Скорость времени, сохранения и параметры текущей сессии.", tone: "settings", ambience: "Время здесь будто замедляется." },
  admin: { eyebrow: "Служебный уровень", title: "Пульт симуляции", subtitle: "Тонкая настройка экономики и событий игрового мира.", tone: "admin", ambience: "Системы симуляции работают штатно." },
};

let db = loadDB();
let currentProfileId = db.lastProfileId || null;
let popupTimeout = null;
let world3d = null;
let uiState = {
  modalItemId: null,
  scroll: {
    windowY: 0,
    feedTop: 0,
    wasAtBottom: false,
  },
  expandedJobCards: [],
  forceTopOnRender: false,
};

function captureScrollState() {
  if (uiState.forceTopOnRender) {
    uiState.expandedJobCards = [];
    uiState.scroll.windowY = 0;
    uiState.scroll.feedTop = 0;
    uiState.forceTopOnRender = false;
    return;
  }
  const feed = document.querySelector(".feed");
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const openedJobs = Array.from(document.querySelectorAll("details[data-job-card][open]")).map((el) => el.dataset.jobCard);
  uiState.expandedJobCards = openedJobs;
  uiState.scroll.windowY = window.scrollY || 0;
  uiState.scroll.feedTop = feed ? feed.scrollTop : 0;
  uiState.scroll.wasAtBottom = maxScroll > 0 && Math.abs((window.scrollY || 0) - maxScroll) <= 4;
}

function restoreScrollState() {
  if (uiState.expandedJobCards?.length) {
    uiState.expandedJobCards.forEach((id) => {
      const el = document.querySelector(`details[data-job-card="${id}"]`);
      if (el) el.open = true;
    });
  }
  if (typeof uiState.scroll.windowY === "number") {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const target = uiState.scroll.wasAtBottom ? maxScroll : Math.min(uiState.scroll.windowY, maxScroll);
    if (Math.abs((window.scrollY || 0) - target) > 1) {
      window.scrollTo({ top: target, behavior: "auto" });
    }
  }
  const feed = document.querySelector(".feed");
  if (feed) {
    feed.scrollTop = uiState.scroll.feedTop || 0;
  }
}

function loadDB() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { profiles: {}, lastProfileId: null };
    const parsed = JSON.parse(raw);
    return parsed && parsed.profiles ? parsed : { profiles: {}, lastProfileId: null };
  } catch {
    return { profiles: {}, lastProfileId: null };
  }
}

function persistDB() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(db));
}

function createProfile(name, difficulty = "normal") {
  const id = `p-${Date.now()}`;
  const now = new Date();
  const jobIds = Object.keys(JOBS);
  const levels = Object.fromEntries(jobIds.map((jobId) => [jobId, 1]));
  const repByJob = Object.fromEntries(jobIds.map((jobId) => [jobId, jobId === "courier" ? 500 : 400]));
  const workedMinutesByJob = Object.fromEntries(jobIds.map((jobId) => [jobId, 0]));
  db.profiles[id] = {
    id,
    name,
    difficulty,
    speed: DEFAULT_SPEED,
    gameTime: now.toISOString(),
    location: "home",
    money: DIFFICULTIES[difficulty].startMoney,
    stats: {
      hunger: 700,
      energy: 650,
      mood: 500,
      health: 800,
      stress: 250,
      hygiene: 600,
      comfort: 180,
    },
    utilities: {
      water: { active: true, consumed: 0, tariff: 1.1, debt: 0, overdueDays: 0 },
      power: { active: true, consumed: 0, tariff: 0.48, debt: 0, overdueDays: 0 },
      rent: { active: true, consumed: 1, tariff: 1800, debt: 0, overdueDays: 0 },
    },
    food: {
      stock: [
        makeFoodItem(SHOP_ITEMS.groceries[0], "pantry"),
        makeFoodItem(SHOP_ITEMS.groceries[1], "pantry"),
      ],
    },
    shopCart: [],
    houseNeeds: {
      dirtyDishes: 0,
      dirtySince: null,
    },
    housing: {
      items: [
        { id: "mattress", name: "Матрас", wear: 900, comfort: 20 },
        { id: "table", name: "Стол", wear: 930, comfort: 35 },
        { id: "lightbulb", name: "Лампочка", wear: 940, comfort: 5, powerPerHour: 0.01 },
        { id: "sink", name: "Раковина", wear: 920, comfort: 10 },
        { id: "shower", name: "Душевая кабина", wear: 900, comfort: 15, waterPerUse: 30 },
      ],
    },
    career: {
      currentJobId: "courier",
      levels,
      rep: repByJob,
      workedMinutesByJob,
      workedMinutesInMonth: 0,
      accruedSalary: 0,
      lastSalaryMonthKey: monthKey(now),
    },
    bank: {
      credit: { principal: 0, balance: 0, startedAt: null },
      deposit: null,
    },
    logs: {
      events: [],
      actions: [],
    },
    reminders: [],
    admin: {
      inflationMonthly: 0.01,
      randomEventsPerDayMin: 1,
      randomEventsPerDayMax: 3,
      keyRate: 21,
    },
    meta: {
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastFoodDayKey: dayKey(now),
      lastPenaltyDayKey: dayKey(now),
      lastEventMinuteTs: 0,
      lastTeethAt: now.toISOString(),
      lastShowerAt: now.toISOString(),
      showerHistory: [],
      teethBrushDayKey: dayKey(now),
      teethBrushCount: 0,
    },
  };
  db.lastProfileId = id;
  currentProfileId = id;
  pushEvent(getProfile(), `Профиль «${name}» создан. Старт: ${fmtMoney(getProfile().money)} €.`, "info");
  persistDB();
}

function getProfile() {
  if (!currentProfileId || !db.profiles[currentProfileId]) return null;
  const p = db.profiles[currentProfileId];
  p.shopCart = p.shopCart || [];
  p.houseNeeds = p.houseNeeds || { dirtyDishes: 0, dirtySince: null };
  if (!p.bank || typeof p.bank !== "object") p.bank = {};
  if (typeof p.bank.credit === "number") {
    p.bank.credit = { principal: p.bank.credit, balance: p.bank.credit, startedAt: p.meta?.createdAt || new Date().toISOString() };
  }
  p.bank.credit = p.bank.credit || { principal: 0, balance: 0, startedAt: null };
  if (typeof p.bank.deposit === "number") {
    p.bank.deposit = p.bank.deposit > 0
      ? { principal: p.bank.deposit, balance: p.bank.deposit, rateAnnual: 0.08, termMonths: 6, startedAt: new Date().toISOString(), endAt: new Date().toISOString() }
      : null;
  }
  p.meta = p.meta || {};
  p.career = p.career || {};
  p.career.levels = p.career.levels || {};
  p.career.rep = p.career.rep || {};
  p.career.workedMinutesByJob = p.career.workedMinutesByJob || {};
  Object.keys(JOBS).forEach((jobId) => {
    if (!Number.isFinite(p.career.levels[jobId])) p.career.levels[jobId] = 1;
    if (!Number.isFinite(p.career.rep[jobId])) p.career.rep[jobId] = jobId === "courier" ? 500 : 400;
    if (!Number.isFinite(p.career.workedMinutesByJob[jobId])) p.career.workedMinutesByJob[jobId] = 0;
  });
  p.meta.lastTeethAt = p.meta.lastTeethAt || p.gameTime;
  p.meta.lastShowerAt = p.meta.lastShowerAt || p.gameTime;
  p.meta.showerHistory = Array.isArray(p.meta.showerHistory) ? p.meta.showerHistory : [];
  p.meta.teethBrushDayKey = p.meta.teethBrushDayKey || dayKey(p.gameTime);
  p.meta.teethBrushCount = Number.isFinite(p.meta.teethBrushCount) ? p.meta.teethBrushCount : 0;
  if (!p.housing?.items?.some((i) => i.id === "table")) {
    p.housing.items = p.housing.items || [];
    p.housing.items.push({ id: "table", name: "Стол", wear: 930, comfort: 35 });
    shiftStat(p, "comfort", 35);
  }
  return p;
}

function monthKey(d) {
  const date = new Date(d);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function dayKey(d) {
  const date = new Date(d);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function clamp(v, min = 0, max = 1000) {
  return Math.max(min, Math.min(max, v));
}

function fmtNumber(v, maximumFractionDigits = 2) {
  const formatted = Number(v).toLocaleString("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
  return formatted.replace(/[\u00A0\u202F]/g, " ");
}

function fmtMoney(v) {
  return fmtNumber(v, 2);
}

function parseLocaleNumber(raw, fallback = 0) {
  if (raw === null || raw === undefined) return fallback;
  const normalized = String(raw).trim().replace(/\s+/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function shiftStat(p, key, delta) {
  p.stats[key] = clamp(p.stats[key] + delta);
}

function pushEvent(profile, text, type = "info", target = null, action = null) {
  profile.logs.events.unshift({ id: `e-${Date.now()}-${Math.random()}`, text, type, ts: profile.gameTime, read: false, target, action });
  profile.logs.events = profile.logs.events.slice(0, 180);
  profile.meta.updatedAt = new Date().toISOString();
  if (type === "critical") showPopup(text);
}

function pushAction(profile, text) {
  profile.logs.actions.unshift({ id: `a-${Date.now()}-${Math.random()}`, text, ts: profile.gameTime });
  profile.logs.actions = profile.logs.actions.slice(0, 260);
}

function showPopup(text) {
  const old = document.querySelector(".popup");
  if (old) old.remove();
  const pop = document.createElement("div");
  pop.className = "popup";
  pop.innerHTML = `<b>Срочно</b><div>${text}</div>`;
  document.body.appendChild(pop);
  clearTimeout(popupTimeout);
  popupTimeout = setTimeout(() => pop.remove(), 3500);
}

function makeFoodItem(def, storage) {
  return {
    id: `${def.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: def.name,
    price: def.price,
    satiety: def.satiety,
    nutrition: def.nutrition,
    daysLeft: def.shelfDays,
    fridgePreferred: def.fridgePreferred,
    storage,
  };
}

function consumeUtilitiesForAction(profile, opts = {}) {
  if (opts.waterUse) {
    profile.utilities.water.consumed += opts.waterUse;
  }
  if (opts.powerUse) {
    profile.utilities.power.consumed += opts.powerUse;
  }
}

function getPenaltyDailyRate(profile, overdueDays) {
  // ЖК РФ (ориентир): после 30 дня 1/300, после 90 дня 1/130 от ключевой ставки
  const keyRate = (profile.admin.keyRate || 21) / 100;
  if (overdueDays <= 30) return 0;
  if (overdueDays <= 90) return keyRate / 300;
  return keyRate / 130;
}

function processDailyDebt(profile) {
  Object.values(profile.utilities).forEach((u) => {
    if (u.debt <= 0) return;
    u.overdueDays += 1;
    const dailyRate = getPenaltyDailyRate(profile, u.overdueDays);
    if (dailyRate > 0) {
      u.debt += u.debt * dailyRate;
    }
    if (u.overdueDays >= 90) {
      u.active = false;
    }
  });
}

function processFoodSpoilage(profile) {
  profile.food.stock = profile.food.stock.filter((f) => {
    let loss = 1;
    if (f.storage === "fridge" && f.fridgePreferred) loss = 0.35;
    if (f.storage === "fridge" && !f.fridgePreferred) loss = 0.7;
    if (f.storage === "pantry" && f.fridgePreferred) loss = 1.5;
    if (f.storage === "table" && f.fridgePreferred) loss = 1.7;
    if (f.storage === "table" && !f.fridgePreferred) loss = 1.15;
    f.daysLeft -= loss;
    if (f.daysLeft <= 0) {
      pushEvent(profile, `Продукт испортился: ${f.name}.`, "critical", "home");
      return false;
    }
    return true;
  });
}

function processMonthChange(profile) {
  const waterBill = profile.utilities.water.consumed * profile.utilities.water.tariff;
  const powerBill = profile.utilities.power.consumed * profile.utilities.power.tariff;
  const rentBill = profile.utilities.rent.tariff;

  profile.utilities.water.debt += waterBill;
  profile.utilities.power.debt += powerBill;
  profile.utilities.rent.debt += rentBill;

  profile.utilities.water.consumed = 0;
  profile.utilities.power.consumed = 0;

  pushEvent(
    profile,
    `Новый счёт ЖКУ: вода ${fmtMoney(waterBill)} €, электричество ${fmtMoney(powerBill)} €, аренда ${fmtMoney(rentBill)} €.`,
    "info",
    "utilities"
  );

  const c = profile.career;
  if (c.accruedSalary > 0) {
    const paid = Math.round(c.accruedSalary);
    profile.money += paid;
    c.accruedSalary = 0;
    c.workedMinutesInMonth = 0;
    c.lastSalaryMonthKey = monthKey(profile.gameTime);
    pushEvent(profile, `Начислена зарплата: +${fmtMoney(paid)} €.`, "info", "work");
  }

  if (profile.bank.deposit?.balance > 0) {
    const gain = Math.round(profile.bank.deposit.balance * ((profile.bank.deposit.rateAnnual || 0.08) / 12));
    profile.bank.deposit.balance += gain;
    pushEvent(profile, `Вклад принёс +${fmtMoney(gain)} €.`, "info", "bank");
  }
  if (profile.bank.credit?.balance > 0) {
    const fee = Math.round(profile.bank.credit.balance * (0.18 / 12));
    profile.bank.credit.balance += fee;
    pushEvent(profile, `Начислены проценты по кредиту: +${fmtMoney(fee)} € к долгу.`, "info", "bank");
  }
}

function applyMinuteTick(profile) {
  const gt = new Date(profile.gameTime);
  gt.setUTCMinutes(gt.getUTCMinutes() + profile.speed);

  const prevMonth = monthKey(profile.gameTime);
  const prevDay = dayKey(profile.gameTime);

  profile.gameTime = gt.toISOString();

  shiftStat(profile, "hunger", -0.12 * profile.speed);
  shiftStat(profile, "energy", -0.27 * profile.speed);
  shiftStat(profile, "hygiene", -0.2 * profile.speed);
  shiftStat(profile, "stress", 0.12 * profile.speed);
  shiftStat(profile, "mood", -0.06 * profile.speed + profile.stats.comfort / 3500);

  if (!profile.utilities.water.active) {
    shiftStat(profile, "hygiene", -0.2 * profile.speed);
    shiftStat(profile, "stress", 0.25 * profile.speed);
  }
  if (!profile.utilities.power.active) {
    shiftStat(profile, "comfort", -0.05 * profile.speed);
    shiftStat(profile, "mood", -0.1 * profile.speed);
  }

  if (profile.stats.energy < 200) shiftStat(profile, "health", -0.15 * profile.speed);
  if (profile.stats.hunger < 180) {
    shiftStat(profile, "health", -0.2 * profile.speed);
    shiftStat(profile, "stress", 0.3 * profile.speed);
  }
  const gtNow = new Date(profile.gameTime);
  const teethHours = (gtNow - new Date(profile.meta.lastTeethAt)) / (1000 * 60 * 60);
  const showerHours = (gtNow - new Date(profile.meta.lastShowerAt)) / (1000 * 60 * 60);
  if (teethHours > 24) {
    shiftStat(profile, "hygiene", -0.45 * profile.speed);
    shiftStat(profile, "health", -0.25 * profile.speed);
  }
  if (showerHours > 30) {
    shiftStat(profile, "hygiene", -0.3 * profile.speed);
    shiftStat(profile, "mood", -0.22 * profile.speed);
  }
  if (profile.houseNeeds?.dirtyDishes > 0) {
    shiftStat(profile, "comfort", -0.08 * profile.speed);
    shiftStat(profile, "mood", -0.06 * profile.speed);
  }

  if (monthKey(profile.gameTime) !== prevMonth) {
    processMonthChange(profile);
  }

  if (dayKey(profile.gameTime) !== prevDay) {
    processDailyDebt(profile);
    processFoodSpoilage(profile);
  }

  maybeTriggerRandomEvent(profile);
}

function maybeTriggerRandomEvent(profile) {
  const avgPerDay = Math.max(0.1, (profile.admin.randomEventsPerDayMin + profile.admin.randomEventsPerDayMax) / 2);
  const chancePerMinute = avgPerDay / (24 * 60);
  const chance = chancePerMinute * profile.speed;
  if (Math.random() > chance) return;

  const roll = Math.random();
  if (roll < 0.12) {
    shiftStat(profile, "health", -70);
    shiftStat(profile, "stress", 60);
    pushEvent(profile, "Простуда: здоровье снижено. Можно обратиться в медицину.", "critical", "clinic");
  } else if (roll < 0.34) {
    shiftStat(profile, "energy", -35);
    shiftStat(profile, "stress", 45);
    pushEvent(profile, "Тяжёлый день на работе: усталость и стресс выросли.", "info", "work");
  } else if (roll < 0.66) {
    shiftStat(profile, "mood", 90);
    shiftStat(profile, "stress", -65);
    pushEvent(profile, "Приятное событие дня подняло настроение.", "info");
  } else {
    pushEvent(profile, "Акция в продуктовом магазине до конца дня.", "info", "shops");
  }
}

function render() {
  if (world3d) {
    world3d.destroy();
    world3d = null;
  }
  captureScrollState();
  const app = document.getElementById("app");
  const p = getProfile();
  app.innerHTML = p ? gameMarkup(p) : authMarkup();
  bindHandlers();
  restoreScrollState();
}

function authMarkup() {
  const list = Object.values(db.profiles).map((p) => `<option value="${p.id}">${p.name} — ${DIFFICULTIES[p.difficulty].label}</option>`).join("");
  return `
  <div class="auth-shell">
    <div class="card">
      <h1 class="auth-title">Survive Life</h1>
      <p class="auth-sub">Создайте профиль игрока или войдите в существующий. Каждый профиль хранит отдельное сохранение.</p>

      <div class="row">
        <input id="newProfileName" type="text" placeholder="Имя профиля" maxlength="24" />
        <select id="difficulty">
          <option value="easy">Легко (20 000 €)</option>
          <option value="normal" selected>Базово (10 000 €)</option>
          <option value="hard">Сложно (5 000 €)</option>
        </select>
        <button class="primary" data-action="createProfile">Создать профиль</button>
      </div>

      <div class="row">
        <select id="existingProfile">
          <option value="">Выбрать профиль</option>
          ${list}
        </select>
        <button data-action="enterProfile">Войти</button>
      </div>

      <div class="row">
        <button data-action="importSave">Импорт JSON</button>
        <button data-action="exportAll">Экспорт всех профилей</button>
      </div>
      <small class="note">Автосохранение включено. Формат валюты: знак после числа (12 345 €).</small>
    </div>
  </div>`;
}

function statLine(name, value, options = {}) {
  const { showValue = true } = options;
  const safeValue = Math.round(value);
  const pct = Math.round((safeValue / 1000) * 100);
  const color = pct < 20 ? "var(--danger)" : pct < 45 ? "#d59012" : "var(--ok)";
  return `<div class="stat"><div class="stat-head"><span>${name}</span>${showValue ? `<b>${safeValue}</b>` : ""}</div><div class="bar"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div></div>`;
}

function infoTile(name, value, extra = "") {
  const label = name ? `<span>${name}</span>` : "";
  return `<div class="stat info"><div class="stat-head">${label}<b>${value}</b></div>${extra ? `<div class="sub">${extra}</div>` : ""}</div>`;
}

function dayProgressValue(isoTime) {
  const d = new Date(isoTime);
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();
  return Math.round((minutes / (24 * 60)) * 1000);
}

function fmtGameDateTime(isoTime) {
  return new Date(isoTime).toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtGameDate(isoTime) {
  return new Date(isoTime).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function fmtGameTime(isoTime) {
  return new Date(isoTime).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDuration(minutes) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h} ч ${m} мин` : `${h} ч`;
  }
  return `${minutes} мин`;
}

function sleepEffects(minutes) {
  const factor = minutes / 120;
  const fullNightFactor = minutes / 480;
  return {
    energy: minutes >= 480 ? Math.round(760 * fullNightFactor) : Math.round(140 * factor),
    stress: minutes >= 480 ? Math.round(-240 * fullNightFactor) : Math.round(-45 * factor),
    health: minutes >= 360 ? Math.round(70 * (minutes / 480)) : 0,
    hunger: Math.round(-18 * factor),
  };
}

function canCookRecipe(profile, recipeId, applianceId) {
  const status = getCookRecipeStatus(profile, recipeId, applianceId);
  return status.canCook;
}

function getCookRecipeStatus(profile, recipeId, applianceId) {
  const recipe = COOKING_RECIPES.find((r) => r.id === recipeId);
  if (!recipe || !recipe.appliances.includes(applianceId)) {
    return { canCook: false, missingIngredients: [] };
  }
  const counts = {};
  profile.food.stock
    .filter((f) => f.storage === "table" || f.storage === "pantry")
    .forEach((f) => { counts[f.id.split("-")[0]] = (counts[f.id.split("-")[0]] || 0) + 1; });
  const missingIngredients = recipe.ingredients.filter((id) => (counts[id] || 0) <= 0);
  return {
    canCook: missingIngredients.length === 0,
    missingIngredients,
  };
}

function overallReputation(p) {
  const reps = Object.values(p.career.rep || {});
  if (!reps.length) return 0;
  return Math.round(reps.reduce((a, b) => a + b, 0) / reps.length);
}

function daysToSalary(p) {
  const now = new Date(p.gameTime);
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  const ms = next - now;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function hoursSince(gameTime, isoTime) {
  return Math.max(0, Math.floor((new Date(gameTime) - new Date(isoTime)) / (1000 * 60 * 60)));
}

function monthlySalaryForLevel(jobId, level = 1) {
  const base = JOBS[jobId].baseHourly;
  return Math.round(base * 160 * (1 + level * 0.07));
}

function getJobLevelRepRequirement(jobId, level = 1) {
  const job = JOBS[jobId];
  const step = job.mode === "fixed" ? 70 : job.mode === "shift" ? 65 : 55;
  return Math.min(1000, (job.unlockRep || 0) + (level - 1) * step);
}

function getPromotionThresholds(jobId, nextLevel) {
  return {
    minutesRequired: Math.max(240, nextLevel * 360),
    repRequired: Math.min(1000, 420 + nextLevel * 70 + (jobId === "warehouse" ? 20 : 0)),
  };
}

function promotionProgress(profile, jobId) {
  const currentLevel = profile.career.levels[jobId] || 1;
  const nextLevel = Math.min(10, currentLevel + 1);
  const workedMinutes = profile.career.workedMinutesByJob?.[jobId] || 0;
  const rep = profile.career.rep?.[jobId] || 0;
  const { minutesRequired, repRequired } = getPromotionThresholds(jobId, nextLevel);
  const timePct = Math.min(100, Math.round((workedMinutes / minutesRequired) * 100));
  const repPct = Math.min(100, Math.round((rep / repRequired) * 100));
  return {
    nextLevel,
    workedMinutes,
    rep,
    minutesRequired,
    repRequired,
    timePct,
    repPct,
    eligible: workedMinutes >= minutesRequired || rep >= repRequired,
  };
}

function getOwnedItemIds(p) {
  return new Set((p.housing.items || []).map((i) => i.id));
}

function getCartQuantity(p, type, id) {
  return p.shopCart.filter((x) => x.type === type && x.id === id).reduce((sum, x) => sum + x.qty, 0);
}

function cartTotal(p) {
  return p.shopCart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function gameMarkup(p) {
  const currentLocation = LOCATIONS.find((l) => l.id === p.location) || LOCATIONS[0];
  const loc = currentLocation.label;
  const scene = WORLD_SCENES[p.location] || WORLD_SCENES.home;
  const dayProgress = dayProgressValue(p.gameTime);
  const rep = overallReputation(p);
  return `
  <div class="game">
    <main class="main">
      <header class="top-hud">
        <div class="game-logo"><i></i><b>SURVIVE / LIFE</b><small>${GAME_VERSION}</small></div>
        <div class="location-crumb"><span>${currentLocation.icon}</span><div><small>СЕЙЧАС</small><b>${loc}</b></div></div>
        <div class="hud-vitals">
          <div title="Здоровье"><span>♥</span><b data-hud="health">${Math.round(p.stats.health / 10)}%</b></div>
          <div title="Энергия"><span>ϟ</span><b data-hud="energy">${Math.round(p.stats.energy / 10)}%</b></div>
          <div title="Настроение"><span>☻</span><b data-hud="mood">${Math.round(p.stats.mood / 10)}%</b></div>
        </div>
        <div class="hud-balance"><small>БАЛАНС</small><b data-hud="money">${fmtMoney(p.money)} €</b></div>
        <div class="hud-time"><small data-hud="date">${fmtGameDate(p.gameTime)}</small><b data-hud="time">${fmtGameTime(p.gameTime)}</b><div class="day-line"><i data-hud="day" style="width:${Math.round((dayProgress / 1000) * 100)}%"></i></div></div>
      </header>

      <section class="scene scene-${scene.tone}" data-world-location="${p.location}">
        <canvas id="worldCanvas" aria-label="Трёхмерная сцена: ${scene.title}"></canvas>
        <div class="scene-vignette"></div>
        <div class="scene-heading"><span>${scene.eyebrow}</span><h1>${scene.title}</h1><p>${scene.subtitle}</p></div>
        <div class="control-hint"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><b>Двигаться</b><i></i><span><kbd>E</kbd></span><b>Действие</b></div>
        <div class="player-tag"><i></i><b>${p.name}</b><small>${JOBS[p.career.currentJobId].name}</small></div>
        <div class="scene-object-menu">
          ${p.location === "home" ? renderHomeItems(p) : `<button data-scroll-actions><i>◆</i><span><b>Исследовать ${loc.toLowerCase()}</b><small>Подойти к точке взаимодействия</small></span><kbd>E</kbd></button>`}
        </div>
      </section>

      <nav class="travel-dock" aria-label="Карта города">
        <div class="travel-title"><small>КАРТА ГОРОДА</small><b>Куда направимся?</b></div>
        <div class="travel-track">${LOCATIONS.map((l, i) => `<button class="${l.id === p.location ? "active" : ""}" data-nav="${l.id}"><i>${String(i + 1).padStart(2, "0")}</i><span>${l.icon}</span><b>${l.label}</b></button>`).join("")}</div>
      </nav>

      <section class="layout">
        <section class="content-panel" id="locationActions">
          <div class="panel-title"><div><span>ВЗАИМОДЕЙСТВИЕ</span><h2>Что будем делать?</h2></div><div class="rep-pill">Репутация <b>${rep}</b></div></div>
          <div class="action-list">${renderLocationActions(p)}</div>
        </section>

        <section class="feed compact-feed">
          <div class="panel-title"><div><span>ПРЯМО СЕЙЧАС</span><h2>Лента города</h2></div><i class="live-dot"></i></div>
          ${p.logs.events.slice(0, 30).map((n) => `<div class="feed-item ${n.type} ${n.target ? "clickable" : ""}" ${n.target ? `data-go="${n.target}" title="Открыть раздел"` : ""}><div class="feed-item-row"><div>${n.text}</div>${n.target ? `<span class="feed-go-icon" aria-hidden="true">↗</span>` : ""}</div><div class="t">${new Date(n.ts).toLocaleString("ru-RU")}</div>${n.action ? `<button data-do="${n.action}">Выполнить</button>` : ""}</div>`).join("") || "<small class='note'>Пока пусто.</small>"}

          <h3 class="feed-subtitle">История действий</h3>
          ${p.logs.actions.slice(0, 25).map((a) => `<div class="feed-item"><div>${a.text}</div><div class="t">${new Date(a.ts).toLocaleString("ru-RU")}</div></div>`).join("") || "<small class='note'>Нет записей.</small>"}
        </section>
      </section>
    </main>

    ${renderItemModal(p)}
  </div>`;
}

function renderHomeItems(p) {
  const items = p.housing.items;
  const visible = items.slice(0, 7);
  return visible.map((it, index) => `<button class="world-object" data-item="${it.id}" data-world-index="${index}"><i>${({ mattress: "▰", table: "◇", lightbulb: "✦", sink: "≈", shower: "≋", fridge: "▣", dishwasher: "▤", stove: "♨", microwave: "▥", coffee: "◒", washer: "◉", armchair: "◫", lamp: "⌁", shelf: "▦", carpet: "▬" })[it.id] || "◆"}</i><span><b>${it.name}</b><small>Состояние ${Math.round(it.wear / 10)}%</small></span><kbd>${index + 1}</kbd></button>`).join("");
}

function renderItemModal(p) {
  if (!uiState.modalItemId) return "";
  const item = p.housing.items.find((x) => x.id === uiState.modalItemId);
  if (!item) return "";

  let body = `<p>Состояние предмета: <b>${item.wear}/1000</b></p>`;
  if (item.id === "fridge") {
    const food = p.food.stock.filter((f) => f.storage === "fridge");
    body += `<h4>Продукты в холодильнике</h4>${food.length ? food.map((f) => `<div class='mini-row'>${f.name} — срок ${fmtNumber(Math.max(0, f.daysLeft), 1)} дн., питательность ${f.nutrition}<div class="row"><button data-do="moveToTable:${f.id}">На стол</button></div></div>`).join("") : "<small>Пусто.</small>"}`;
  }
  if (item.id === "table") {
    const tableFood = p.food.stock.filter((f) => f.storage === "table" || f.storage === "pantry");
    const hasFridge = p.housing.items.some((i) => i.id === "fridge");
    body += `<h4>Продукты на столе</h4>${tableFood.length ? tableFood.map((f) => `<div class='mini-row'>${f.name} — срок ${fmtNumber(Math.max(0, f.daysLeft), 1)} дн., питательность ${f.nutrition}<div class="row"><button data-do="eatFood:${f.id}">Съесть</button>${hasFridge ? `<button data-do="moveToFridge:${f.id}">В холодильник</button>` : ""}</div></div>`).join("") : "<small>На столе пусто.</small>"}`;
    if (!hasFridge) body += `<small class="note">Чтобы убирать продукты в холод, купите холодильник.</small>`;
  }
  if (item.id === "sink") {
    const dirty = p.houseNeeds?.dirtyDishes || 0;
    body += `<h4>Действия у раковины</h4>
      ${actionBtn("Помыть руки", "+гигиена, небольшой комфорт.", "washHands", 2)}
      ${actionBtn("Помыть посуду", `Грязной посуды: ${dirty}.`, "sinkDishes", 12, { disabled: dirty <= 0 })}`;
  }
  if (item.id === "dishwasher") {
    const dirty = p.houseNeeds?.dirtyDishes || 0;
    body += `<h4>Посудомоечная машина</h4>
      <div class="mini-row">Грязной посуды: <b>${dirty}</b></div>
      ${actionBtn("Сложить посуду и запустить", "Экономит воду и время.", "dishwasherRun", 9, { disabled: dirty <= 0 })}`;
  }
  if (item.id === "shower") {
    const showerHours = hoursSince(p.gameTime, p.meta.lastShowerAt);
    body += `<h4>Гигиена</h4>${actionBtn("Принять душ", `Последний душ: ${showerHours} ч назад.`, "shower", 15)}`;
  }
  if (["mattress", "bed", "sofa"].includes(item.id)) {
    const fx8 = sleepEffects(8 * 60);
    const fx2 = sleepEffects(2 * 60);
    body += `<h4>Сон</h4>
      ${actionBtn("Сон", `Восстановление: +${fx8.energy} энергии, ${fx8.stress} стресса, голод ${fx8.hunger}.`, "sleep:480", 8 * 60)}
      ${actionBtn("Сон", `Восстановление: +${fx2.energy} энергии, ${fx2.stress} стресса, голод ${fx2.hunger}.`, "sleep:120", 2 * 60)}
      <div class="row"><button data-do="sleepCustom">Выбрать длительность...</button></div>`;
  }
  if (["microwave", "stove"].includes(item.id)) {
    const recipes = COOKING_RECIPES.filter((r) => r.appliances.includes(item.id));
    const cookedMeals = p.food.stock.filter((f) => f.id.startsWith("meal-"));
    body += `<h4>Приготовление еды</h4><div class="mini-row">Приготовленных блюд в запасе: <b>${cookedMeals.length}</b></div>${recipes.map((r) => {
      const cookStatus = getCookRecipeStatus(p, r.id, item.id);
      const buttonLabel = cookStatus.canCook ? "Приготовить" : "Недостаточно ингредиентов";
      const cookedByRecipe = cookedMeals.filter((f) => f.id.startsWith(`meal-${r.id}-`)).length;
      return `<div class="mini-row"><b>${r.name}</b> (${fmtDuration(r.minutes)})<div>Ингредиенты: ${r.ingredients.join(" + ")}</div><div>Питательность блюда: ${r.nutrition}</div><div>Уже приготовлено: ${cookedByRecipe}</div><div class="row"><button data-do="cook:${item.id}:${r.id}" ${cookStatus.canCook ? "" : "disabled"}>${buttonLabel}</button></div></div>`;
    }).join("")}`;
  }

  return `<div class="modal-backdrop" data-closemodal="1"><div class="modal" onclick="event.stopPropagation()"><h3>${item.name}</h3>${body}<div class="row"><button data-closemodal="1">Закрыть</button></div></div></div>`;
}

function actionBtn(title, desc, key, minutes, options = {}) {
  const { disabled = false } = options;
  const urgent = String(desc).includes("[!]");
  const safeDesc = String(desc).replace("[!]", "");
  return `<div class="action-item ${urgent ? "urgent-item" : ""}"><div><b>${title}${minutes > 0 ? ` (${fmtDuration(minutes)})` : ""}</b><div style="color:var(--muted);font-size:13px">${safeDesc}</div></div><button class="${urgent ? "urgent-btn" : ""}" data-do="${key}" ${disabled ? "disabled" : ""}>Выполнить</button></div>`;
}

function renderLocationActions(p) {
  const job = JOBS[p.career.currentJobId];
  if (p.location === "home") {
    const teethHours = hoursSince(p.gameTime, p.meta.lastTeethAt);
    const noEnergy = p.stats.energy <= 0;
    return [
      actionBtn("Почистить зубы", `${teethHours > 24 ? "[!] " : ""}+гигиена, +настроение. Последняя чистка: ${teethHours} ч назад.`, "teeth", 6),
      actionBtn("Поесть со стола", "Продукты размещаются на столе и управляются через предметы дома.", "eat", 20),
      actionBtn("Тренировка", noEnergy ? "Недоступно при нулевой энергии." : "+здоровье, -стресс, -энергия", "workout", 45, { disabled: noEnergy }),
      actionBtn("Прогулка", noEnergy ? "Недоступно при нулевой энергии." : "+настроение, +здоровье", "walk", 40, { disabled: noEnergy }),
      `<small class="note">Сон, душ, мойка рук/посуды и готовка теперь запускаются через предметы в блоке «Дом и предметы».</small>`,
    ].join("");
  }

  if (p.location === "work") {
    const progress = promotionProgress(p, p.career.currentJobId);
    const noEnergy = p.stats.energy <= 0;
    return [
      `<div class="job-status"><b>${job.name}</b><div>Накоплено к выплате: <b>${fmtMoney(p.career.accruedSalary)} €</b></div><div>До выплаты: <b>${daysToSalary(p)} дн.</b></div><div>Репутация: ${p.career.rep[p.career.currentJobId]} | Уровень: ${p.career.levels[p.career.currentJobId]}</div></div>`,
      `<div class="job-status"><b>Готовность к повышению (до уровня ${progress.nextLevel})</b><div style="margin-top:6px">Стаж на должности: ${Math.floor(progress.workedMinutes / 60)} ч / ${Math.floor(progress.minutesRequired / 60)} ч</div><div class="bar"><div class="bar-fill" style="width:${progress.timePct}%"></div></div><div style="margin-top:6px">Репутация: ${progress.rep} / ${progress.repRequired}</div><div class="bar"><div class="bar-fill" style="width:${progress.repPct}%"></div></div><small class="note">Повышение возможно при выполнении хотя бы одного условия.</small></div>`,
      actionBtn("Работать 2 часа", noEnergy ? "Недоступно при нулевой энергии." : "Опыт и накопление к месячной зарплате.", "work2", 2 * 60, { disabled: noEnergy }),
      actionBtn("Работать 8 часов", noEnergy ? "Недоступно при нулевой энергии." : "Основная смена.", "work8", 8 * 60, { disabled: noEnergy }),
      actionBtn("Подать на повышение", "Требуется стаж на должности или достаточная репутация.", "promotion", 30),
    ].join("");
  }

  if (p.location === "shops") {
    const owned = getOwnedItemIds(p);
    const renderShopRow = (type, item, extra, disabled = false) => {
      const qty = getCartQuantity(p, type, item.id);
      return `<div class="shop-row ${disabled ? "shop-row-disabled" : ""}">
        <div><b>${item.name}</b><div class="shop-note">${extra}</div></div>
        <div class="shop-qty">
          <button data-do="cartDec:${type}:${item.id}" ${qty <= 0 ? "disabled" : ""}>−</button>
          <b>${qty}</b>
          <button data-do="cartAdd:${type}:${item.id}" ${disabled ? "disabled" : ""}>+</button>
          <span>${fmtMoney(item.price * qty)} €</span>
        </div>
      </div>`;
    };
    const groceries = SHOP_ITEMS.groceries.map((g) => renderShopRow("food", g, `${g.price} € / шт • Питательность ${g.nutrition}, срок ${g.shelfDays} дн.`)).join("");
    const appliances = SHOP_ITEMS.appliances.map((it) => renderShopRow("appliance", it, `${it.price} € • Комфорт +${it.comfort || 0}${owned.has(it.id) ? " • Уже установлен" : ""}`, owned.has(it.id))).join("");
    const homeGoods = SHOP_ITEMS.home.map((it) => renderShopRow("home", it, `${it.price} € • Комфорт +${it.comfort || 0}${owned.has(it.id) ? " • Уже есть дома" : ""}`, owned.has(it.id))).join("");
    return `<div class="utility-card shop-cart-summary"><b>Корзина</b><div>Товаров: ${p.shopCart.reduce((s, x) => s + x.qty, 0)} | Сумма: ${fmtMoney(cartTotal(p))} €</div><div class="row"><button data-do="cartCheckout">Оформить покупку</button><button data-do="cartClear">Отменить всё</button></div></div><h4>Продукты</h4>${groceries}<h4>Бытовая техника</h4>${appliances}<h4>Всё для дома</h4>${homeGoods}`;
  }

  if (p.location === "utilities") {
    const u = p.utilities;
    return `
    <div class="utility-card">
      <div><b>Вода</b>: расход ${fmtNumber(u.water.consumed, 1)} м³, текущие начисления ${fmtMoney(u.water.consumed * u.water.tariff)} €, долг ${fmtMoney(u.water.debt)} €, статус: ${u.water.active ? "активно" : "отключено"}, просрочка ${u.water.overdueDays} дн.</div>
      <div><b>Электричество</b>: расход ${fmtNumber(u.power.consumed, 1)} кВт·ч, текущие начисления ${fmtMoney(u.power.consumed * u.power.tariff)} €, долг ${fmtMoney(u.power.debt)} €, статус: ${u.power.active ? "активно" : "отключено"}, просрочка ${u.power.overdueDays} дн.</div>
      <div><b>Аренда</b>: долг ${fmtMoney(u.rent.debt)} €, статус договора: ${u.rent.active ? "активно" : "остановлено"}, просрочка ${u.rent.overdueDays} дн.</div>
      <small class="note">Вода и электричество начисляются в долг на начало следующего месяца.</small>
    </div>
    ${actionBtn("Оплатить воду", "Погашение полного долга по воде.", "payWater", 8)}
    ${actionBtn("Оплатить электричество", "Погашение полного долга по электроснабжению.", "payPower", 8)}
    ${actionBtn("Оплатить аренду", "Погашение долга по аренде.", "payRent", 8)}
    ${actionBtn("Оплатить всё", "Погашение всех задолженностей.", "payAllUtilities", 12)}`;
  }

  if (p.location === "bank") {
    const dep = p.bank.deposit;
    const credit = p.bank.credit;
    const depositSummary = dep
      ? `<div class="utility-card"><b>Активный вклад</b><div>Сумма: ${fmtMoney(dep.balance)} € (внесено ${fmtMoney(dep.principal)} €)</div><div>Ставка: ${fmtNumber(dep.rateAnnual * 100, 1)}% годовых, срок: ${dep.termMonths} мес.</div><div>Окончание: ${new Date(dep.endAt).toLocaleDateString("ru-RU")}</div><div>Ожидаемая выгода к концу срока: ${fmtMoney(Math.max(0, Math.round(dep.principal * ((1 + dep.rateAnnual / 12) ** dep.termMonths - 1))))} €</div></div>`
      : `<div class="utility-card"><b>Вклад не открыт</b></div>`;
    const creditSummary = credit?.balance > 0
      ? `<div class="utility-card"><b>Кредит</b><div>Тело кредита: ${fmtMoney(credit.principal)} €</div><div>Текущий долг: ${fmtMoney(credit.balance)} €</div><div>Переплата: ${fmtMoney(Math.max(0, credit.balance - credit.principal))} €</div></div>`
      : `<div class="utility-card"><b>Кредитов нет</b></div>`;
    return [
      depositSummary,
      creditSummary,
      actionBtn("Взять кредит 1000 €", "Годовая ставка 18%.", "takeCredit", 15),
      actionBtn("Погасить кредит 500 €", "Списывает из долга.", "payCredit", 10),
      actionBtn("Открыть вклад 500 € на 3 мес", "Годовая ставка 8%.", "openDeposit:3", 10),
      actionBtn("Открыть вклад 500 € на 6 мес", "Годовая ставка 8%.", "openDeposit:6", 10),
      actionBtn("Открыть вклад 500 € на 12 мес", "Годовая ставка 8%.", "openDeposit:12", 10),
      actionBtn("Закрыть вклад", "Возврат вклада на баланс.", "closeDeposit", 10),
    ].join("");
  }

  if (p.location === "jobs") {
    return Object.entries(JOBS).map(([id, j]) => {
      const lvl = p.career.levels[id];
      const rep = p.career.rep[id];
      const playerRep = overallReputation(p);
      const neededRepForCurrentLevel = getJobLevelRepRequirement(id, lvl);
      const locked = playerRep < neededRepForCurrentLevel;
      const levelRows = Array.from({ length: 10 }).map((_, idx) => `<div class="salary-row"><span>Уровень ${idx + 1}</span><span>мин. репутация ${getJobLevelRepRequirement(id, idx + 1)}</span><b>${fmtMoney(monthlySalaryForLevel(id, idx + 1))} €/мес</b></div>`).join("");
      return `<details class="action-item job-card" data-job-card="${id}"><summary><b>${j.name}</b> — уровень ${lvl}, репутация ${rep}, доход ${fmtMoney(monthlySalaryForLevel(id, lvl))} €/мес ${locked ? `<span class="lock-badge">Нужно ${neededRepForCurrentLevel} репутации</span>` : ""}</summary><div style="color:var(--muted);font-size:13px;margin:6px 0">Тип: ${j.mode}${j.shift ? `, график: ${j.shift}` : ""}</div><div class="salary-grid">${levelRows}</div><div class="row"><button ${locked ? "disabled" : ""} data-job="${id}">${locked ? "Недоступно" : "Выбрать"}</button></div></details>`;
    }).join("");
  }

  if (p.location === "clinic") {
    return [
      actionBtn("Поликлиника (200 €)", "+здоровье, -стресс, медленно.", "clinic", 60),
      actionBtn("Больница (900 €)", "Сильное восстановление.", "hospital", 150),
    ].join("");
  }

  if (p.location === "settings") {
    return `
      <div class="utility-card"><b>Игровые настройки</b><div class="row"><label>Скорость</label>
      <select id="speedSelect">
        <option value="1" ${p.speed === 1 ? "selected" : ""}>x1</option>
        <option value="2" ${p.speed === 2 ? "selected" : ""}>x2</option>
        <option value="5" ${p.speed === 5 ? "selected" : ""}>x5</option>
        <option value="10" ${p.speed === 10 ? "selected" : ""}>x10</option>
      </select></div>
      <div class="row"><button data-action="exportProfile">Экспорт профиля</button><button data-action="exportAll">Экспорт всех</button><button class="warn" data-action="logout">Выйти</button></div>
      </div>
    `;
  }

  if (p.location === "admin") {
    return `
      <div class="admin-box">
        <label>Инфляция в месяц: <input id="adminInfl" type="text" inputmode="decimal" value="${fmtNumber(p.admin.inflationMonthly, 3)}" /></label>
        <label>Событий/день минимум: <input id="adminEvtMin" type="number" step="1" value="${p.admin.randomEventsPerDayMin}" /></label>
        <label>Событий/день максимум: <input id="adminEvtMax" type="number" step="1" value="${p.admin.randomEventsPerDayMax}" /></label>
        <label>Ключевая ставка ЦБ (%): <input id="adminRate" type="text" inputmode="decimal" value="${fmtNumber(p.admin.keyRate, 1)}" /></label>
      </div>
      ${actionBtn("Сохранить админ-настройки", "Применить параметры баланса.", "adminSave", 0)}
      ${actionBtn("Сброс админ-настроек", "Сброс к значениям по умолчанию.", "adminReset", 0)}
    `;
  }
  return "";
}

function advanceGameMinutes(profile, minutes, actionName = "") {
  const prev = profile.speed;
  profile.speed = 1;
  for (let i = 0; i < minutes; i++) applyMinuteTick(profile);
  profile.speed = prev;
  if (actionName) pushAction(profile, `${actionName} (${minutes} мин).`);
}

function addHousingItem(profile, itemDef) {
  if (profile.housing.items.some((i) => i.id === itemDef.id)) {
    pushEvent(profile, `Предмет уже есть: ${itemDef.name}.`, "info", "home");
    return false;
  }
  profile.housing.items.push({
    id: itemDef.id,
    name: itemDef.name,
    wear: itemDef.durability || 1000,
    comfort: itemDef.comfort || 0,
    powerPerHour: itemDef.powerPerHour || 0,
    waterSave: itemDef.waterSave || 0,
    moodBoost: itemDef.moodBoost || 0,
  });
  shiftStat(profile, "comfort", itemDef.comfort || 0);
  return true;
}

function doAction(rawKey) {
  const p = getProfile();
  if (!p) return;

  if (rawKey.startsWith("cartAdd:")) {
    const [, type, id] = rawKey.split(":");
    const catalog = type === "food" ? SHOP_ITEMS.groceries : type === "appliance" ? SHOP_ITEMS.appliances : SHOP_ITEMS.home;
    const item = catalog.find((x) => x.id === id);
    if (!item) return;
    const owned = getOwnedItemIds(p);
    if (type !== "food" && owned.has(id)) return pushEvent(p, `${item.name} уже есть дома.`, "info", "home");
    const row = p.shopCart.find((x) => x.type === type && x.id === id);
    if (row) row.qty += 1;
    else p.shopCart.push({ type, id, qty: 1, name: item.name, price: item.price });
    render();
    return;
  }
  if (rawKey.startsWith("cartDec:")) {
    const [, type, id] = rawKey.split(":");
    const row = p.shopCart.find((x) => x.type === type && x.id === id);
    if (!row) return;
    row.qty -= 1;
    p.shopCart = p.shopCart.filter((x) => x.qty > 0);
    render();
    return;
  }
  if (rawKey === "cartClear") {
    p.shopCart = [];
    render();
    return;
  }
  if (rawKey === "cartCheckout") {
    const total = cartTotal(p);
    if (total <= 0) return;
    if (p.money < total) return pushEvent(p, "Недостаточно денег для оплаты корзины.", "critical");
    p.money -= total;
    for (const ci of p.shopCart) {
      if (ci.type === "food") {
        const f = SHOP_ITEMS.groceries.find((x) => x.id === ci.id);
        for (let i = 0; i < ci.qty; i++) p.food.stock.push(makeFoodItem(f, "table"));
      } else {
        const item = (ci.type === "appliance" ? SHOP_ITEMS.appliances : SHOP_ITEMS.home).find((x) => x.id === ci.id);
        addHousingItem(p, item);
      }
    }
    advanceGameMinutes(p, 20, "Покупки в магазине");
    pushEvent(p, `Корзина оплачена: ${fmtMoney(total)} €.`, "info", "home");
    p.shopCart = [];
    persistDB();
    render();
    return;
  }

  if (rawKey.startsWith("moveToFridge:")) {
    const foodId = rawKey.split(":")[1];
    const food = p.food.stock.find((f) => f.id === foodId);
    if (!food) return;
    if (!p.housing.items.some((i) => i.id === "fridge")) return pushEvent(p, "Сначала купите холодильник.", "info", "shops");
    food.storage = "fridge";
    persistDB();
    render();
    return;
  }
  if (rawKey.startsWith("moveToTable:")) {
    const foodId = rawKey.split(":")[1];
    const food = p.food.stock.find((f) => f.id === foodId);
    if (!food) return;
    food.storage = "table";
    persistDB();
    render();
    return;
  }
  if (rawKey.startsWith("eatFood:")) {
    const foodId = rawKey.split(":")[1];
    const idx = p.food.stock.findIndex((f) => f.id === foodId);
    if (idx < 0) return;
    const food = p.food.stock[idx];
    p.food.stock.splice(idx, 1);
    advanceGameMinutes(p, 20, `Приём пищи: ${food.name}`);
    shiftStat(p, "hunger", food.satiety);
    shiftStat(p, "mood", Math.round(food.nutrition / 5));
    p.houseNeeds.dirtyDishes += 1;
    p.houseNeeds.dirtySince = p.houseNeeds.dirtySince || p.gameTime;
    persistDB();
    render();
    return;
  }
  if (rawKey.startsWith("cook:")) {
    const [, applianceId, recipeId] = rawKey.split(":");
    const recipe = COOKING_RECIPES.find((r) => r.id === recipeId);
    if (!recipe || !recipe.appliances.includes(applianceId)) return;
    const cookStatus = getCookRecipeStatus(p, recipeId, applianceId);
    if (!cookStatus.canCook) return pushEvent(p, `Не хватает ингредиентов для блюда «${recipe.name}» на столе.`, "info", "home");
    const usedIndexes = [];
    for (const ingredientId of recipe.ingredients) {
      const idx = p.food.stock.findIndex((f, i) => (f.storage === "table" || f.storage === "pantry")
        && !usedIndexes.includes(i)
        && f.id.startsWith(`${ingredientId}-`));
      if (idx < 0) return pushEvent(p, `Не хватает ингредиентов для блюда «${recipe.name}» на столе.`, "info", "home");
      usedIndexes.push(idx);
    }
    p.food.stock = p.food.stock.filter((_, i) => !usedIndexes.includes(i));
    p.food.stock.push({
      id: `meal-${recipe.id}-${Date.now()}`,
      name: recipe.name,
      price: 0,
      satiety: recipe.satiety,
      nutrition: recipe.nutrition,
      daysLeft: 2.5,
      fridgePreferred: true,
      storage: "table",
    });
    advanceGameMinutes(p, recipe.minutes, `Приготовление: ${recipe.name}`);
    shiftStat(p, "mood", 15);
    consumeUtilitiesForAction(p, { powerUse: applianceId === "stove" ? 0.07 : 0.05, waterUse: 0.01 });
    p.houseNeeds.dirtyDishes += 1;
    p.houseNeeds.dirtySince = p.houseNeeds.dirtySince || p.gameTime;
    pushEvent(p, `Блюдо готово: ${recipe.name}. Оно размещено на столе.`, "info", "home");
    persistDB();
    render();
    return;
  }
  if (rawKey === "sleepCustom") {
    const hoursRaw = prompt("Введите длительность сна в часах (например, 3.5):", "6");
    const hours = Number(hoursRaw);
    if (!Number.isFinite(hours) || hours <= 0) return;
    return doAction(`sleep:${Math.round(hours * 60)}`);
  }

  if (rawKey.startsWith("buyFood:")) {
    const id = rawKey.split(":")[1];
    const f = SHOP_ITEMS.groceries.find((x) => x.id === id);
    if (!f) return;
    if (p.money < f.price) return pushEvent(p, "Недостаточно денег.", "critical");
    p.money -= f.price;
    const storage = "table";
    p.food.stock.push(makeFoodItem(f, storage));
    advanceGameMinutes(p, 15, `Покупка продукта: ${f.name}`);
    pushEvent(p, `Куплено: ${f.name}. Размещение: ${storage === "fridge" ? "холодильник" : "стол"}.`, "info", "home");
    persistDB();
    render();
    return;
  }

  if (rawKey.startsWith("buyAppliance:")) {
    const id = rawKey.split(":")[1];
    const item = SHOP_ITEMS.appliances.find((x) => x.id === id);
    if (!item) return;
    if (p.money < item.price) return pushEvent(p, "Недостаточно денег.", "critical");
    if (!addHousingItem(p, item)) return;
    p.money -= item.price;
    advanceGameMinutes(p, 25, `Покупка техники: ${item.name}`);
    pushEvent(p, `Покупка: ${item.name}.`, "info", "home");
    persistDB();
    render();
    return;
  }

  if (rawKey.startsWith("buyHome:")) {
    const id = rawKey.split(":")[1];
    const item = SHOP_ITEMS.home.find((x) => x.id === id);
    if (!item) return;
    if (p.money < item.price) return pushEvent(p, "Недостаточно денег.", "critical");
    if (!addHousingItem(p, item)) return;
    p.money -= item.price;
    advanceGameMinutes(p, 20, `Покупка для дома: ${item.name}`);
    pushEvent(p, `Куплен предмет: ${item.name}.`, "info", "home");
    persistDB();
    render();
    return;
  }

  if (rawKey.startsWith("sleep:")) {
    const minutes = Math.max(15, Number(rawKey.split(":")[1] || 0));
    if (!Number.isFinite(minutes)) return;
    const fx = sleepEffects(minutes);
    advanceGameMinutes(p, minutes, `Сон (${fmtDuration(minutes)})`);
    shiftStat(p, "energy", fx.energy);
    shiftStat(p, "stress", fx.stress);
    shiftStat(p, "health", fx.health);
    shiftStat(p, "hunger", fx.hunger);
    persistDB();
    render();
    return;
  }

  switch (rawKey) {
    case "sleep8":
    case "sleep2":
      return doAction(rawKey === "sleep8" ? "sleep:480" : "sleep:120");
    case "washHands":
      advanceGameMinutes(p, 2, "Мытьё рук");
      shiftStat(p, "hygiene", 45);
      shiftStat(p, "comfort", 8);
      consumeUtilitiesForAction(p, { waterUse: 0.015 });
      break;
    case "sinkDishes":
      return doAction("dishes");
    case "dishwasherRun":
      if ((p.houseNeeds?.dirtyDishes || 0) <= 0) {
        pushEvent(p, "Грязной посуды нет — запуск не требуется.", "info", "home");
        persistDB();
        render();
        return;
      }
      advanceGameMinutes(p, 9, "Запуск посудомоечной машины");
      shiftStat(p, "comfort", 16);
      shiftStat(p, "hygiene", 10);
      consumeUtilitiesForAction(p, { waterUse: 0.03, powerUse: 0.03 });
      p.houseNeeds.dirtyDishes = 0;
      p.houseNeeds.dirtySince = null;
      break;
    case "shower":
      p.meta.showerHistory = (p.meta.showerHistory || []).filter((ts) => (new Date(p.gameTime) - new Date(ts)) < (24 * 60 * 60 * 1000));
      if (p.meta.showerHistory.length >= 3) {
        pushEvent(p, "Слишком часто: душ можно принимать не более 3 раз за 24 часа.", "info", "home");
        persistDB();
        render();
        return;
      }
      advanceGameMinutes(p, 15, "Душ");
      shiftStat(p, "hygiene", 320);
      shiftStat(p, "stress", -55);
      p.meta.lastShowerAt = p.gameTime;
      p.meta.showerHistory.push(p.gameTime);
      consumeUtilitiesForAction(p, { waterUse: 0.12, powerUse: 0.05 });
      break;
    case "teeth":
      if (p.meta.teethBrushDayKey !== dayKey(p.gameTime)) {
        p.meta.teethBrushDayKey = dayKey(p.gameTime);
        p.meta.teethBrushCount = 0;
      }
      if (p.meta.teethBrushCount >= 4) {
        pushEvent(p, "Лимит чистки зубов: не более 4 раз в сутки.", "info", "home");
        persistDB();
        render();
        return;
      }
      advanceGameMinutes(p, 6, "Чистка зубов");
      shiftStat(p, "hygiene", 190);
      shiftStat(p, "mood", 30);
      p.meta.lastTeethAt = p.gameTime;
      p.meta.teethBrushCount += 1;
      consumeUtilitiesForAction(p, { waterUse: 0.02 });
      break;
    case "eat": {
      const food = p.food.stock.find((f) => f.storage === "table" || f.storage === "pantry") || p.food.stock[0];
      if (!food) return pushEvent(p, "Нет продуктов. Сходите в магазин.", "critical", "shops");
      p.food.stock = p.food.stock.filter((f) => f.id !== food.id);
      advanceGameMinutes(p, 20, `Приём пищи: ${food.name}`);
      shiftStat(p, "hunger", food.satiety);
      shiftStat(p, "mood", Math.round(food.nutrition / 6));
      p.houseNeeds.dirtyDishes += 1;
      p.houseNeeds.dirtySince = p.houseNeeds.dirtySince || p.gameTime;
      break;
    }
    case "dishes": {
      if ((p.houseNeeds?.dirtyDishes || 0) <= 0) {
        pushEvent(p, "Грязной посуды нет — мыть пока нечего.", "info", "home");
        persistDB();
        render();
        return;
      }
      advanceGameMinutes(p, 12, "Мытьё посуды");
      shiftStat(p, "comfort", 10);
      shiftStat(p, "hygiene", 20);
      const hasDishwasher = p.housing.items.some((i) => i.id === "dishwasher");
      consumeUtilitiesForAction(p, { waterUse: hasDishwasher ? 0.03 : 0.08, powerUse: hasDishwasher ? 0.02 : 0 });
      p.houseNeeds.dirtyDishes = 0;
      p.houseNeeds.dirtySince = null;
      break;
    }
    case "workout":
      if (p.stats.energy <= 0) return pushEvent(p, "Нельзя тренироваться при нулевой энергии.", "info", "home");
      advanceGameMinutes(p, 45, "Тренировка дома");
      shiftStat(p, "health", 35);
      shiftStat(p, "stress", -35);
      shiftStat(p, "energy", -90);
      shiftStat(p, "hunger", -60);
      break;
    case "walk":
      if (p.stats.energy <= 0) return pushEvent(p, "Нельзя идти на прогулку при нулевой энергии.", "info", "home");
      advanceGameMinutes(p, 40, "Прогулка");
      shiftStat(p, "mood", 45);
      shiftStat(p, "health", 20);
      shiftStat(p, "stress", -25);
      break;
    case "work2":
      doWorkHours(2);
      persistDB();
      render();
      return;
    case "work8":
      doWorkHours(8);
      persistDB();
      render();
      return;
    case "promotion": {
      advanceGameMinutes(p, 30, "Подача заявки на повышение");
      const jobId = p.career.currentJobId;
      const prog = promotionProgress(p, jobId);
      if (p.career.levels[jobId] >= 10) {
        pushEvent(p, `Достигнут максимальный уровень в должности ${JOBS[jobId].name}.`, "info", "work");
      } else if (prog.eligible) {
        p.career.levels[jobId] += 1;
        p.career.workedMinutesByJob[jobId] = 0;
        pushEvent(p, `Повышение! ${JOBS[jobId].name} уровень ${p.career.levels[jobId]}.`, "info", "work");
      } else {
        shiftStat(p, "mood", -20);
        pushEvent(p, `В повышении отказано: нужно ${Math.floor(prog.minutesRequired / 60)} ч стажа или репутация ${prog.repRequired}.`, "info", "work");
      }
      break;
    }
    case "takeCredit":
      advanceGameMinutes(p, 15, "Оформление кредита");
      p.bank.credit.principal += 1000;
      p.bank.credit.balance += 1000;
      p.bank.credit.startedAt = p.bank.credit.startedAt || p.gameTime;
      p.money += 1000;
      pushEvent(p, "Кредит оформлен: +1000 €.", "info", "bank");
      break;
    case "payCredit":
      if (p.bank.credit.balance <= 0) return;
      if (p.money < 500) return pushEvent(p, "Недостаточно денег для погашения.", "critical");
      advanceGameMinutes(p, 10, "Погашение кредита");
      p.money -= 500;
      p.bank.credit.balance = Math.max(0, p.bank.credit.balance - 500);
      break;
    case "openDeposit":
      if (p.bank.deposit?.balance > 0) return pushEvent(p, "Сначала закройте текущий вклад.", "critical");
      if (p.money < 500) return pushEvent(p, "Недостаточно денег.", "critical");
      advanceGameMinutes(p, 10, "Открытие вклада");
      p.money -= 500;
      p.bank.deposit = {
        principal: 500,
        balance: 500,
        rateAnnual: 0.08,
        termMonths: 6,
        startedAt: p.gameTime,
        endAt: new Date(new Date(p.gameTime).setUTCMonth(new Date(p.gameTime).getUTCMonth() + 6)).toISOString(),
      };
      break;
    case "openDeposit:3":
    case "openDeposit:6":
    case "openDeposit:12": {
      if (p.bank.deposit?.balance > 0) return pushEvent(p, "Сначала закройте текущий вклад.", "critical");
      if (p.money < 500) return pushEvent(p, "Недостаточно денег.", "critical");
      const months = Number(rawKey.split(":")[1]);
      advanceGameMinutes(p, 10, `Открытие вклада на ${months} мес.`);
      p.money -= 500;
      const now = new Date(p.gameTime);
      const end = new Date(now);
      end.setUTCMonth(end.getUTCMonth() + months);
      p.bank.deposit = { principal: 500, balance: 500, rateAnnual: 0.08, termMonths: months, startedAt: now.toISOString(), endAt: end.toISOString() };
      break;
    }
    case "closeDeposit":
      if (!p.bank.deposit || p.bank.deposit.balance <= 0) return;
      advanceGameMinutes(p, 10, "Закрытие вклада");
      p.money += p.bank.deposit.balance;
      p.bank.deposit = null;
      break;
    case "clinic":
      if (p.money < 200) return pushEvent(p, "Недостаточно денег.", "critical");
      advanceGameMinutes(p, 60, "Посещение поликлиники");
      p.money -= 200;
      shiftStat(p, "health", 130);
      shiftStat(p, "stress", -50);
      break;
    case "hospital":
      if (p.money < 900) return pushEvent(p, "Недостаточно денег.", "critical");
      advanceGameMinutes(p, 150, "Посещение больницы");
      p.money -= 900;
      shiftStat(p, "health", 320);
      shiftStat(p, "stress", -120);
      break;
    case "payWater":
      payUtility(p, "water");
      advanceGameMinutes(p, 8, "Оплата воды");
      break;
    case "payPower":
      payUtility(p, "power");
      advanceGameMinutes(p, 8, "Оплата электричества");
      break;
    case "payRent":
      payUtility(p, "rent");
      advanceGameMinutes(p, 8, "Оплата аренды");
      break;
    case "payAllUtilities":
      payUtility(p, "water");
      payUtility(p, "power");
      payUtility(p, "rent");
      advanceGameMinutes(p, 12, "Оплата всех ЖКУ");
      break;
    case "adminSave": {
      p.admin.inflationMonthly = parseLocaleNumber(document.getElementById("adminInfl")?.value, p.admin.inflationMonthly);
      p.admin.randomEventsPerDayMin = Number(document.getElementById("adminEvtMin")?.value || p.admin.randomEventsPerDayMin);
      p.admin.randomEventsPerDayMax = Number(document.getElementById("adminEvtMax")?.value || p.admin.randomEventsPerDayMax);
      p.admin.keyRate = parseLocaleNumber(document.getElementById("adminRate")?.value, p.admin.keyRate);
      pushEvent(p, "Админ-параметры сохранены.", "info", "admin");
      break;
    }
    case "adminReset":
      p.admin.inflationMonthly = 0.01;
      p.admin.randomEventsPerDayMin = 1;
      p.admin.randomEventsPerDayMax = 3;
      p.admin.keyRate = 21;
      pushEvent(p, "Админ-параметры сброшены к значениям по умолчанию.", "info", "admin");
      break;
    default:
      break;
  }

  p.meta.updatedAt = new Date().toISOString();
  persistDB();
  render();
}

function payUtility(profile, key) {
  const u = profile.utilities[key];
  if (!u || u.debt <= 0) return;
  const amount = Math.round(u.debt);
  if (profile.money < amount) {
    pushEvent(profile, `Недостаточно денег для оплаты ${labelUtility(key)}.`, "critical", "utilities");
    return;
  }
  profile.money -= amount;
  u.debt = 0;
  u.overdueDays = 0;
  u.active = true;
  pushEvent(profile, `${labelUtility(key)} оплачено: ${fmtMoney(amount)} €.`, "info", "utilities");
}

function labelUtility(k) {
  return ({ water: "Водоснабжение", power: "Электроснабжение", rent: "Аренда" })[k] || k;
}

function doWorkHours(hours) {
  const p = getProfile();
  if (p.stats.energy <= 0) {
    pushEvent(p, "Нельзя работать при нулевой энергии. Сначала восстановитесь.", "info", "home");
    return;
  }
  const jobId = p.career.currentJobId;
  const job = JOBS[jobId];

  advanceGameMinutes(p, hours * 60, `Работа (${hours} ч)`);
  const lvl = p.career.levels[jobId];
  const efficiency = (p.stats.energy * 0.28 + (1000 - p.stats.stress) * 0.24 + p.stats.hygiene * 0.16 + p.stats.mood * 0.16 + p.stats.health * 0.16) / 1000;
  const accrued = Math.round(hours * job.baseHourly * (1 + lvl * 0.07) * (0.7 + efficiency));
  p.career.accruedSalary += accrued;
  p.career.workedMinutesInMonth += hours * 60;
  p.career.workedMinutesByJob[jobId] += hours * 60;
  p.career.rep[jobId] = clamp(p.career.rep[jobId] + Math.round(12 * efficiency - 2));
  shiftStat(p, "stress", job.stressPerHour * hours);
  shiftStat(p, "energy", -12 * hours);
  shiftStat(p, "hunger", -20 * hours);

  if (Math.random() < 0.03 && job.mode === "fixed") {
    p.career.rep[jobId] = clamp(p.career.rep[jobId] - 35);
    pushEvent(p, "Отмечен прогул в фиксированном графике: падение репутации.", "critical", "work");
  }

  pushEvent(p, `Рабочие часы учтены. К месячной выплате добавлено: ${fmtMoney(accrued)} €.`, "info", "work");
}

class World3D {
  constructor(canvas, location) {
    this.canvas = canvas;
    this.location = location;
    this.gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    this.keys = new Set();
    this.player = { x: 0, z: 3, angle: Math.PI, step: 0 };
    this.target = null;
    this.objectCallback = null;
    this.last = performance.now();
    this.frame = 0;
    if (!this.gl) {
      canvas.classList.add("webgl-unavailable");
      return;
    }
    this.onKeyDown = (e) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) e.preventDefault();
      this.keys.add(e.key.toLowerCase());
      const n = Number(e.key);
      if (n >= 1 && n <= 7) document.querySelector(`[data-world-index="${n - 1}"]`)?.click();
      if (e.key.toLowerCase() === "e") document.querySelector(".scene-object-menu button")?.click();
    };
    this.onKeyUp = (e) => this.keys.delete(e.key.toLowerCase());
    this.onPointer = (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      this.target = [(nx - .5) * 16, (ny - .38) * 14];
      this.objectCallback = null;
    };
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    canvas.addEventListener("pointerdown", this.onPointer);
    this.initGL();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
    this.loop = (now) => {
      this.update(Math.min(.04, (now - this.last) / 1000));
      this.last = now;
      this.draw(now / 1000);
      this.frame = requestAnimationFrame(this.loop);
    };
    this.frame = requestAnimationFrame(this.loop);
  }

  initGL() {
    const gl = this.gl;
    const vertex = `attribute vec3 p; uniform mat4 mvp; uniform mat4 model; varying vec3 n; void main(){n=normalize(mat3(model)*p);gl_Position=mvp*vec4(p,1.0);}`;
    const fragment = `precision mediump float; uniform vec3 color; varying vec3 n; void main(){float l=.48+.42*max(0.0,dot(normalize(n),normalize(vec3(.4,.8,.3))));gl_FragColor=vec4(color*l,1.0);}`;
    const compile = (type, source) => { const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s); return s; };
    this.program = gl.createProgram();
    gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vertex));
    gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(this.program); gl.useProgram(this.program);
    const v = [-1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, -1,-1,1, 1,-1,1, 1,1,1, -1,1,1];
    const ind = [0,1,2,0,2,3, 4,6,5,4,7,6, 0,4,5,0,5,1, 3,2,6,3,6,7, 1,5,6,1,6,2, 0,3,7,0,7,4];
    this.vb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,this.vb); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.STATIC_DRAW);
    this.ib=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ind),gl.STATIC_DRAW);
    const pos=gl.getAttribLocation(this.program,"p"); gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos,3,gl.FLOAT,false,0,0);
    this.uMvp=gl.getUniformLocation(this.program,"mvp"); this.uModel=gl.getUniformLocation(this.program,"model"); this.uColor=gl.getUniformLocation(this.program,"color");
    gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE);
  }

  resize() { const d=Math.min(2,devicePixelRatio||1); const w=Math.round(this.canvas.clientWidth*d),h=Math.round(this.canvas.clientHeight*d); if(w&&h&&(w!==this.canvas.width||h!==this.canvas.height)){this.canvas.width=w;this.canvas.height=h;} }
  identity(){return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
  multiply(a,b){const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o}
  perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]}
  lookAt(e,t,u=[0,1,0]){let z=this.norm([e[0]-t[0],e[1]-t[1],e[2]-t[2]]),x=this.norm(this.cross(u,z)),y=this.cross(z,x);return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-this.dot(x,e),-this.dot(y,e),-this.dot(z,e),1]}
  norm(v){const l=Math.hypot(...v)||1;return v.map(x=>x/l)} cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]} dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
  model(x,y,z,sx,sy,sz,ry=0){const c=Math.cos(ry),s=Math.sin(ry);return [c*sx,0,-s*sx,0,0,sy,0,0,s*sz,0,c*sz,0,x,y,z,1]}
  cube(x,y,z,sx,sy,sz,color,ry=0){const gl=this.gl,m=this.model(x,y,z,sx,sy,sz,ry),mvp=this.multiply(this.vp,m);gl.uniformMatrix4fv(this.uModel,false,m);gl.uniformMatrix4fv(this.uMvp,false,mvp);gl.uniform3fv(this.uColor,color);gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_SHORT,0)}
  walkTo(index, callback){const spots=[[-5,1],[-2,-3],[4,-2],[6,2],[5,5],[-5,5],[1,6]];this.target=spots[index]||[0,0];this.objectCallback=callback}
  update(dt){let dx=0,dz=0;if(this.keys.has("w"))dz-=1;if(this.keys.has("s"))dz+=1;if(this.keys.has("a"))dx-=1;if(this.keys.has("d"))dx+=1;if(dx||dz){this.target=null;const l=Math.hypot(dx,dz);dx/=l;dz/=l;this.player.x+=dx*dt*4;this.player.z+=dz*dt*4;this.player.angle=Math.atan2(dx,dz);this.player.step+=dt*10}else if(this.target){const dx=this.target[0]-this.player.x,dz=this.target[1]-this.player.z,d=Math.hypot(dx,dz);if(d<.22){this.target=null;const cb=this.objectCallback;this.objectCallback=null;if(cb)cb()}else{this.player.x+=dx/d*dt*4;this.player.z+=dz/d*dt*4;this.player.angle=Math.atan2(dx,dz);this.player.step+=dt*10}}this.player.x=Math.max(-8,Math.min(8,this.player.x));this.player.z=Math.max(-6,Math.min(8,this.player.z))}
  draw(t){const gl=this.gl,w=this.canvas.width,h=this.canvas.height;gl.viewport(0,0,w,h);const palettes={home:[.045,.065,.105],work:[.035,.06,.11],shops:[.11,.045,.08],clinic:[.025,.09,.105],bank:[.075,.065,.045],jobs:[.04,.075,.09],utilities:[.07,.065,.055],settings:[.035,.035,.08],admin:[.015,.025,.055]};const bg=palettes[this.location]||palettes.home;gl.clearColor(...bg,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const p=this.player;const eye=[p.x+9,8,p.z+12],target=[p.x,1.2,p.z];this.vp=this.multiply(this.perspective(.76,w/h,.1,100),this.lookAt(eye,target));
    this.cube(0,-.35,1,10,.25,8,[.13,.15,.18]); this.cube(0,4,-7,10,4,.25,[.08,.12,.18]); this.cube(-9,3,1,.25,3.3,8,[.1,.13,.17]);
    const sceneColors={home:[.18,.42,.38],work:[.17,.3,.55],shops:[.58,.18,.32],clinic:[.15,.55,.58],bank:[.52,.4,.16]};const ac=sceneColors[this.location]||[.25,.35,.5];
    for(let i=0;i<7;i++){const spots=[[-6,.8,1],[-2,.55,-4],[4,.8,-3],[7,1,2],[6,1,6],[-6,1,6],[1,.8,7]][i];this.cube(spots[0],spots[1],spots[2],.9,spots[1],.8,ac,i*.3)}
    for(let i=-7;i<8;i+=2)this.cube(i,2.5,-6.65,.65,2.2,.18,[.07+.02*(i%3),.16,.24]);
    const moving=this.target||this.keys.has("w")||this.keys.has("a")||this.keys.has("s")||this.keys.has("d"),swing=moving?Math.sin(p.step)*.35:0;
    this.cube(p.x,2.7,p.z,.38,.42,.38,[.68,.39,.27],p.angle);this.cube(p.x,1.72,p.z,.62,.62,.32,[.12,.43,.62],p.angle);this.cube(p.x-.34,1.65,p.z,.16,.6,.16,[.68,.39,.27],p.angle+swing);this.cube(p.x+.34,1.65,p.z,.16,.6,.16,[.68,.39,.27],p.angle-swing);this.cube(p.x-.25,.62,p.z,.2,.62,.22,[.06,.08,.12],p.angle-swing);this.cube(p.x+.25,.62,p.z,.2,.62,.22,[.06,.08,.12],p.angle+swing);
    this.cube(0,.02,1,8.5,.015,.04,[.2+.06*Math.sin(t),.8,.58]);
  }
  destroy(){cancelAnimationFrame(this.frame);this.resizeObserver?.disconnect();window.removeEventListener("keydown",this.onKeyDown);window.removeEventListener("keyup",this.onKeyUp);this.canvas.removeEventListener("pointerdown",this.onPointer)}
}

function bindHandlers() {
  const app = document.getElementById("app");

  app.querySelectorAll("[data-action='createProfile']").forEach((btn) => btn.onclick = () => {
    const name = document.getElementById("newProfileName").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    if (!name) return alert("Введите имя профиля");
    createProfile(name, difficulty);
    render();
  });

  app.querySelectorAll("[data-action='enterProfile']").forEach((btn) => btn.onclick = () => {
    const id = document.getElementById("existingProfile").value;
    if (!id || !db.profiles[id]) return;
    currentProfileId = id;
    db.lastProfileId = id;
    persistDB();
    render();
  });

  app.querySelectorAll("[data-action='logout']").forEach((btn) => btn.onclick = () => {
    currentProfileId = null;
    uiState.modalItemId = null;
    persistDB();
    render();
  });

  app.querySelectorAll("[data-nav]").forEach((btn) => btn.onclick = () => {
    const p = getProfile();
    p.location = btn.dataset.nav;
    uiState.forceTopOnRender = true;
    pushAction(p, `Переход в раздел: ${LOCATIONS.find((l) => l.id === p.location)?.label || p.location}.`);
    persistDB();
    render();
  });

  app.querySelectorAll("[data-do]").forEach((btn) => btn.onclick = () => doAction(btn.dataset.do));

  app.querySelectorAll("[data-job]").forEach((btn) => btn.onclick = () => {
    const p = getProfile();
    const targetJobId = btn.dataset.job;
    const level = p.career.levels[targetJobId] || 1;
    const needRep = getJobLevelRepRequirement(targetJobId, level);
    const playerRep = overallReputation(p);
    if (playerRep < needRep) {
      pushEvent(p, `Недостаточно репутации для ${JOBS[targetJobId].name}: нужно ${needRep}, сейчас ${playerRep}.`, "critical", "jobs");
      persistDB();
      render();
      return;
    }
    p.career.currentJobId = targetJobId;
    pushEvent(p, `Выбрана работа: ${JOBS[targetJobId].name}.`, "info", "work");
    persistDB();
    render();
  });

  app.querySelectorAll("[data-go]").forEach((btn) => btn.onclick = () => {
    const p = getProfile();
    p.location = btn.dataset.go;
    uiState.forceTopOnRender = true;
    persistDB();
    render();
  });

  app.querySelectorAll("[data-item]").forEach((btn) => btn.onclick = () => {
    const openItem = () => {
      uiState.modalItemId = btn.dataset.item;
      render();
    };
    if (world3d) world3d.walkTo(Number(btn.dataset.worldIndex || 0), openItem);
    else openItem();
  });

  app.querySelectorAll("[data-scroll-actions]").forEach((btn) => btn.onclick = () => {
    app.querySelector("#locationActions")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  app.querySelectorAll("[data-closemodal]").forEach((btn) => btn.onclick = () => {
    uiState.modalItemId = null;
    render();
  });

  const speedSelect = app.querySelector("#speedSelect");
  if (speedSelect) {
    speedSelect.onchange = () => {
      const p = getProfile();
      p.speed = Number(speedSelect.value);
      persistDB();
    };
  }

  app.querySelectorAll("[data-action='exportProfile']").forEach((btn) => btn.onclick = () => {
    const p = getProfile();
    downloadJSON(`${p.name}-save.json`, p);
  });

  app.querySelectorAll("[data-action='exportAll']").forEach((btn) => btn.onclick = () => {
    downloadJSON("survive-life-profiles.json", db);
  });

  app.querySelectorAll("[data-action='importSave']").forEach((btn) => btn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed.profiles) db = parsed;
          else if (parsed.id && parsed.name) {
            db.profiles[parsed.id || `p-${Date.now()}`] = parsed;
          } else throw new Error("bad format");
          persistDB();
          render();
        } catch {
          alert("Не удалось импортировать JSON");
        }
      };
      reader.readAsText(f);
    };
    input.click();
  });

  const syncScrollDependentUI = () => {
    const stats = document.getElementById("statsBar");
    if (!stats) return;
    const compact = window.scrollY > 20;
    stats.classList.toggle("compact", compact);
  };
  window.onscroll = syncScrollDependentUI;
  syncScrollDependentUI();
  const canvas = app.querySelector("#worldCanvas");
  if (canvas) world3d = new World3D(canvas, canvas.closest("[data-world-location]")?.dataset.worldLocation || "home");
}

function downloadJSON(name, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

setInterval(() => {
  const p = getProfile();
  if (!p) return;
  applyMinuteTick(p);
  p.meta.updatedAt = new Date().toISOString();
  persistDB();
  const active = document.activeElement;
  if (active && active.id === "speedSelect") return;
  if (world3d) {
    const values = {
      health: `${Math.round(p.stats.health / 10)}%`, energy: `${Math.round(p.stats.energy / 10)}%`,
      mood: `${Math.round(p.stats.mood / 10)}%`, money: `${fmtMoney(p.money)} €`,
      date: fmtGameDate(p.gameTime), time: fmtGameTime(p.gameTime),
    };
    Object.entries(values).forEach(([key, value]) => {
      const node = document.querySelector(`[data-hud="${key}"]`);
      if (node) node.textContent = value;
    });
    const day = document.querySelector('[data-hud="day"]');
    if (day) day.style.width = `${Math.round(dayProgressValue(p.gameTime) / 10)}%`;
    return;
  }
  render();
}, TICK_MS);

setInterval(() => {
  persistDB();
}, 10000);

render();
