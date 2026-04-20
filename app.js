const SAVE_KEY = "survive-life-v2";
const TICK_MS = 1000;
const DEFAULT_SPEED = 1;
const GAME_VERSION = "v0.20";

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
    { id: "apple", name: "Яблоко", price: 2, satiety: 45, nutrition: 45, shelfDays: 6, fridgePreferred: false },
    { id: "milk", name: "Молоко", price: 3, satiety: 60, nutrition: 60, shelfDays: 3, fridgePreferred: true },
    { id: "bread", name: "Хлеб", price: 2, satiety: 55, nutrition: 55, shelfDays: 5, fridgePreferred: false },
    { id: "chicken", name: "Курица", price: 7, satiety: 120, nutrition: 85, shelfDays: 2, fridgePreferred: true },
    { id: "egg", name: "Яйца", price: 4, satiety: 70, nutrition: 75, shelfDays: 8, fridgePreferred: true },
    { id: "rice", name: "Рис", price: 3, satiety: 80, nutrition: 65, shelfDays: 12, fridgePreferred: false },
    { id: "potato", name: "Картофель", price: 3, satiety: 75, nutrition: 60, shelfDays: 9, fridgePreferred: false },
    { id: "tomato", name: "Помидоры", price: 3, satiety: 40, nutrition: 70, shelfDays: 5, fridgePreferred: true },
    { id: "cheese", name: "Сыр", price: 5, satiety: 65, nutrition: 85, shelfDays: 6, fridgePreferred: true },
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

let db = loadDB();
let currentProfileId = db.lastProfileId || null;
let popupTimeout = null;
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

function fmtMoney(v) {
  return Number(v).toLocaleString("ru-RU");
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
  const recipe = COOKING_RECIPES.find((r) => r.id === recipeId);
  if (!recipe || !recipe.appliances.includes(applianceId)) return false;
  const counts = {};
  profile.food.stock.forEach((f) => { counts[f.id.split("-")[0]] = (counts[f.id.split("-")[0]] || 0) + 1; });
  return recipe.ingredients.every((id) => (counts[id] || 0) > 0);
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
  const loc = LOCATIONS.find((l) => l.id === p.location)?.label || p.location;
  const dayProgress = dayProgressValue(p.gameTime);
  const rep = overallReputation(p);
  const statsCompact = (uiState.scroll.windowY || 0) > 20 ? "compact" : "";
  const dateTimeTile = `
    <div class="stat info datetime-progress">
      <div class="stat-head"><span>${fmtGameDate(p.gameTime)}</span><b>${fmtGameTime(p.gameTime)}</b></div>
      <div class="bar"><div class="bar-fill" style="width:${Math.round((dayProgress / 1000) * 100)}%"></div></div>
    </div>
  `;
  return `
  <div class="game">
    <aside class="sidebar">
      ${LOCATIONS.map((l) => {
        const button = `<button class="${l.id === p.location ? "active" : ""}" data-nav="${l.id}">${l.icon}</button>`;
        if (l.id === "settings") return `${button}<div class="sidebar-version" title="Версия на основе текущего количества изменений в репозитории">Версия ${GAME_VERSION}</div>`;
        return button;
      }).join("")}
    </aside>

    <main class="main">
      <section class="stats ${statsCompact}" id="statsBar">
        <div class="stats-grid">
          ${statLine("Голод", p.stats.hunger)}
          ${statLine("Энергия", p.stats.energy)}
          ${statLine("Настроение", p.stats.mood)}
          ${statLine("Здоровье", p.stats.health)}
          ${statLine("Стресс", p.stats.stress)}
          ${statLine("Гигиена", p.stats.hygiene)}
          ${statLine("Комфорт", p.stats.comfort)}
          ${infoTile("Баланс", `${fmtMoney(p.money)} €`)}
          ${dateTimeTile}
          ${statLine("Репутация", rep)}
        </div>
      </section>

      <section class="layout">
        <section class="content-panel">
          <h3 style="margin-top:0">${loc}</h3>
          <div class="action-list">${renderLocationActions(p)}</div>
          ${p.location === "home" ? renderHomeItems(p) : ""}
        </section>

        <section class="feed compact-feed">
          <h3 style="margin-top:0">Игровые события</h3>
          ${p.logs.events.slice(0, 30).map((n) => `<div class="feed-item ${n.type} ${n.target ? "clickable" : ""}" ${n.target ? `data-go="${n.target}" title="Открыть раздел"` : ""}><div class="feed-item-row"><div>${n.text}</div>${n.target ? `<span class="feed-go-icon" aria-hidden="true">↗</span>` : ""}</div><div class="t">${new Date(n.ts).toLocaleString("ru-RU")}</div>${n.action ? `<button data-do="${n.action}">Выполнить</button>` : ""}</div>`).join("") || "<small class='note'>Пока пусто.</small>"}

          <h3>Журнал действий</h3>
          ${p.logs.actions.slice(0, 25).map((a) => `<div class="feed-item"><div>${a.text}</div><div class="t">${new Date(a.ts).toLocaleString("ru-RU")}</div></div>`).join("") || "<small class='note'>Нет записей.</small>"}
        </section>
      </section>
    </main>

    ${renderItemModal(p)}
  </div>`;
}

function renderHomeItems(p) {
  const items = p.housing.items;
  return `
  <h4>Дом и предметы</h4>
  <div class="home-grid">
    ${items.map((it) => `<button class="home-item" data-item="${it.id}">
      <div><b>${it.name}</b></div>
      <div class="dur-wrap"><div class="dur-fill" style="width:${Math.max(2, it.wear / 10)}%"></div></div>
      <small>Состояние: ${it.wear}/1000</small>
    </button>`).join("")}
  </div>`;
}

function renderItemModal(p) {
  if (!uiState.modalItemId) return "";
  const item = p.housing.items.find((x) => x.id === uiState.modalItemId);
  if (!item) return "";

  let body = `<p>Состояние предмета: <b>${item.wear}/1000</b></p>`;
  if (item.id === "fridge") {
    const food = p.food.stock.filter((f) => f.storage === "fridge");
    body += `<h4>Продукты в холодильнике</h4>${food.length ? food.map((f) => `<div class='mini-row'>${f.name} — срок ${Math.max(0, f.daysLeft).toFixed(1)} дн., питательность ${f.nutrition}<div class="row"><button data-do="moveToTable:${f.id}">На стол</button></div></div>`).join("") : "<small>Пусто.</small>"}`;
  }
  if (item.id === "table") {
    const tableFood = p.food.stock.filter((f) => f.storage === "table" || f.storage === "pantry");
    const hasFridge = p.housing.items.some((i) => i.id === "fridge");
    body += `<h4>Продукты на столе</h4>${tableFood.length ? tableFood.map((f) => `<div class='mini-row'>${f.name} — срок ${Math.max(0, f.daysLeft).toFixed(1)} дн., питательность ${f.nutrition}<div class="row"><button data-do="eatFood:${f.id}">Съесть</button>${hasFridge ? `<button data-do="moveToFridge:${f.id}">В холодильник</button>` : ""}</div></div>`).join("") : "<small>На столе пусто.</small>"}`;
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
    body += `<h4>Приготовление еды</h4>${recipes.map((r) => {
      const canCook = canCookRecipe(p, r.id, item.id);
      return `<div class="mini-row"><b>${r.name}</b> (${fmtDuration(r.minutes)})<div>Ингредиенты: ${r.ingredients.join(" + ")}</div><div>Питательность блюда: ${r.nutrition}</div><div class="row"><button data-do="cook:${item.id}:${r.id}" ${canCook ? "" : "disabled"}>Приготовить</button></div></div>`;
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
      <div><b>Вода</b>: расход ${u.water.consumed.toFixed(1)} м³, текущие начисления ${fmtMoney(u.water.consumed * u.water.tariff)} €, долг ${fmtMoney(u.water.debt)} €, статус: ${u.water.active ? "активно" : "отключено"}, просрочка ${u.water.overdueDays} дн.</div>
      <div><b>Электричество</b>: расход ${u.power.consumed.toFixed(1)} кВт·ч, текущие начисления ${fmtMoney(u.power.consumed * u.power.tariff)} €, долг ${fmtMoney(u.power.debt)} €, статус: ${u.power.active ? "активно" : "отключено"}, просрочка ${u.power.overdueDays} дн.</div>
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
      ? `<div class="utility-card"><b>Активный вклад</b><div>Сумма: ${fmtMoney(dep.balance)} € (внесено ${fmtMoney(dep.principal)} €)</div><div>Ставка: ${(dep.rateAnnual * 100).toFixed(1)}% годовых, срок: ${dep.termMonths} мес.</div><div>Окончание: ${new Date(dep.endAt).toLocaleDateString("ru-RU")}</div><div>Ожидаемая выгода к концу срока: ${fmtMoney(Math.max(0, Math.round(dep.principal * ((1 + dep.rateAnnual / 12) ** dep.termMonths - 1))))} €</div></div>`
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
        <label>Инфляция в месяц: <input id="adminInfl" type="number" step="0.001" value="${p.admin.inflationMonthly}" /></label>
        <label>Событий/день минимум: <input id="adminEvtMin" type="number" step="1" value="${p.admin.randomEventsPerDayMin}" /></label>
        <label>Событий/день максимум: <input id="adminEvtMax" type="number" step="1" value="${p.admin.randomEventsPerDayMax}" /></label>
        <label>Ключевая ставка ЦБ (%): <input id="adminRate" type="number" step="0.1" value="${p.admin.keyRate}" /></label>
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
    const usedIndexes = [];
    for (const ingredientId of recipe.ingredients) {
      const idx = p.food.stock.findIndex((f, i) => !usedIndexes.includes(i) && f.id.startsWith(`${ingredientId}-`));
      if (idx < 0) return pushEvent(p, `Не хватает ингредиентов для блюда «${recipe.name}».`, "info", "home");
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
      p.admin.inflationMonthly = Number(document.getElementById("adminInfl")?.value || p.admin.inflationMonthly);
      p.admin.randomEventsPerDayMin = Number(document.getElementById("adminEvtMin")?.value || p.admin.randomEventsPerDayMin);
      p.admin.randomEventsPerDayMax = Number(document.getElementById("adminEvtMax")?.value || p.admin.randomEventsPerDayMax);
      p.admin.keyRate = Number(document.getElementById("adminRate")?.value || p.admin.keyRate);
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
    uiState.modalItemId = btn.dataset.item;
    render();
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
  render();
}, TICK_MS);

setInterval(() => {
  persistDB();
}, 10000);

render();
