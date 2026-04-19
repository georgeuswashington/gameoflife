const SAVE_KEY = "survive-life-v2";
const TICK_MS = 1000;
const DEFAULT_SPEED = 1;

const DIFFICULTIES = {
  easy: { label: "Легко", startMoney: 20000 },
  normal: { label: "Базово", startMoney: 10000 },
  hard: { label: "Сложно", startMoney: 5000 },
};

const JOBS = {
  courier: { name: "Курьер", mode: "flex", stressPerHour: 18, baseHourly: 11 },
  callcenter: { name: "Оператор колл-центра", mode: "fixed", stressPerHour: 12, baseHourly: 10, shift: "09:00–18:00, 5/2" },
  warehouse: { name: "Помощник на складе", mode: "shift", stressPerHour: 16, baseHourly: 12, shift: "2/2 по 12ч" },
};

const SHOP_ITEMS = {
  groceries: [
    { id: "apple", name: "Яблоко", price: 40, satiety: 80, nutrition: 45, shelfDays: 6, fridgePreferred: false },
    { id: "milk", name: "Молоко", price: 90, satiety: 120, nutrition: 65, shelfDays: 3, fridgePreferred: true },
    { id: "bread", name: "Хлеб", price: 70, satiety: 100, nutrition: 40, shelfDays: 5, fridgePreferred: false },
    { id: "chicken", name: "Курица", price: 180, satiety: 180, nutrition: 90, shelfDays: 2, fridgePreferred: true },
  ],
  appliances: [
    { id: "fridge", name: "Холодильник", price: 2400, comfort: 70, powerPerHour: 0.05, durability: 1000 },
    { id: "dishwasher", name: "Посудомойка", price: 2900, comfort: 40, powerPerHour: 0.06, waterSave: 0.35, durability: 1000 },
    { id: "washer", name: "Стиральная машина", price: 3100, comfort: 50, powerPerHour: 0.07, durability: 1000 },
    { id: "coffee", name: "Кофе-машина", price: 1400, comfort: 25, moodBoost: 30, powerPerHour: 0.03, durability: 1000 },
    { id: "kettle", name: "Электрочайник", price: 800, comfort: 15, powerPerHour: 0.02, durability: 1000 },
  ],
  home: [
    { id: "table", name: "Стол", price: 700, comfort: 35, durability: 1000 },
    { id: "chair", name: "Стул", price: 260, comfort: 15, durability: 1000 },
    { id: "armchair", name: "Кресло", price: 900, comfort: 45, durability: 1000 },
    { id: "lamp", name: "Торшер", price: 520, comfort: 20, powerPerHour: 0.02, durability: 1000 },
  ],
};

const LOCATIONS = [
  { id: "home", icon: "🏠", label: "Дом" },
  { id: "work", icon: "💼", label: "Работа" },
  { id: "shops", icon: "🛒", label: "Магазины" },
  { id: "utilities", icon: "🧾", label: "ЖКУ" },
  { id: "bank", icon: "🏦", label: "Банк" },
  { id: "jobs", icon: "📄", label: "Рынок труда" },
  { id: "clinic", icon: "🏥", label: "Медицина" },
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
  },
};

function captureScrollState() {
  const feed = document.querySelector(".feed");
  uiState.scroll.windowY = window.scrollY || 0;
  uiState.scroll.feedTop = feed ? feed.scrollTop : 0;
}

function restoreScrollState() {
  const feed = document.querySelector(".feed");
  if (feed) {
    feed.scrollTop = uiState.scroll.feedTop || 0;
  }
  if (typeof uiState.scroll.windowY === "number") {
    window.scrollTo({ top: uiState.scroll.windowY, behavior: "auto" });
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
    housing: {
      items: [
        { id: "mattress", name: "Матрас", wear: 900, comfort: 20 },
        { id: "lightbulb", name: "Лампочка", wear: 940, comfort: 5, powerPerHour: 0.01 },
        { id: "sink", name: "Раковина", wear: 920, comfort: 10 },
        { id: "shower", name: "Душевая кабина", wear: 900, comfort: 15, waterPerUse: 30 },
      ],
    },
    career: {
      currentJobId: "courier",
      levels: { courier: 1, callcenter: 1, warehouse: 1 },
      rep: { courier: 500, callcenter: 400, warehouse: 400 },
      workedMinutesInMonth: 0,
      accruedSalary: 0,
      lastSalaryMonthKey: monthKey(now),
    },
    bank: {
      credit: 0,
      deposit: 0,
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
    },
  };
  db.lastProfileId = id;
  currentProfileId = id;
  pushEvent(getProfile(), `Профиль «${name}» создан. Старт: ${fmtMoney(getProfile().money)} €.`, "info");
  persistDB();
}

function getProfile() {
  return currentProfileId ? db.profiles[currentProfileId] : null;
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
  return Math.max(min, Math.min(max, Math.round(v)));
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

  if (profile.bank.deposit > 0) {
    const gain = Math.round(profile.bank.deposit * (0.08 / 12));
    profile.bank.deposit += gain;
    pushEvent(profile, `Вклад принёс +${fmtMoney(gain)} €.`, "info", "bank");
  }
  if (profile.bank.credit > 0) {
    const fee = Math.round(profile.bank.credit * (0.18 / 12));
    profile.bank.credit += fee;
    pushEvent(profile, `Начислены проценты по кредиту: +${fmtMoney(fee)} € к долгу.`, "info", "bank");
  }
}

function applyMinuteTick(profile) {
  const gt = new Date(profile.gameTime);
  gt.setUTCMinutes(gt.getUTCMinutes() + profile.speed);

  const prevMonth = monthKey(profile.gameTime);
  const prevDay = dayKey(profile.gameTime);

  profile.gameTime = gt.toISOString();

  shiftStat(profile, "hunger", -0.38 * profile.speed);
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
    const bonus = 250 + Math.round(Math.random() * 250);
    profile.money += bonus;
    pushEvent(profile, `Премия на работе: +${fmtMoney(bonus)} €.`, "info", "work");
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

function statLine(name, value) {
  const pct = Math.round((value / 1000) * 100);
  const color = pct < 20 ? "var(--danger)" : pct < 45 ? "#d59012" : "var(--ok)";
  return `<div class="stat"><div class="stat-head"><span>${name}</span><b>${value}</b></div><div class="bar"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div></div>`;
}

function daysToSalary(p) {
  const now = new Date(p.gameTime);
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
  const ms = next - now;
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function gameMarkup(p) {
  const gt = new Date(p.gameTime);
  const loc = LOCATIONS.find((l) => l.id === p.location)?.label || p.location;
  return `
  <div class="game">
    <aside class="sidebar">
      ${LOCATIONS.map((l) => `<button class="${l.id === p.location ? "active" : ""}" data-nav="${l.id}">${l.icon}</button>`).join("")}
    </aside>

    <main class="main">
      <section class="topbar" id="topbar">
        <div class="meta compact-meta">
          <span class="avatar">👤</span>
          <span>Время: <b>${gt.toLocaleString("ru-RU")}</b></span>
          <span>Локация: <b>${loc}</b></span>
          <span>Баланс: <b>${fmtMoney(p.money)} €</b></span>
        </div>
        <div class="row">
          <label>Скорость</label>
          <select id="speedSelect">
            <option value="1" ${p.speed === 1 ? "selected" : ""}>x1</option>
            <option value="2" ${p.speed === 2 ? "selected" : ""}>x2</option>
            <option value="5" ${p.speed === 5 ? "selected" : ""}>x5</option>
            <option value="10" ${p.speed === 10 ? "selected" : ""}>x10</option>
          </select>
          <button data-action="exportProfile">Экспорт</button>
          <button class="warn" data-action="logout">Выйти</button>
        </div>
      </section>

      <section class="stats" id="statsBar">
        <div class="stats-grid">
          ${statLine("Голод", p.stats.hunger)}
          ${statLine("Энергия", p.stats.energy)}
          ${statLine("Настроение", p.stats.mood)}
          ${statLine("Здоровье", p.stats.health)}
          ${statLine("Стресс", p.stats.stress)}
          ${statLine("Гигиена", p.stats.hygiene)}
          ${statLine("Комфорт", p.stats.comfort)}
        </div>
      </section>

      <section class="layout">
        <section class="content-panel">
          <h3 style="margin-top:0">${loc}</h3>
          <div class="action-list">${renderLocationActions(p)}</div>
          ${p.location === "home" ? renderHomeItems(p) : ""}
        </section>

        <section class="feed">
          <h3 style="margin-top:0">Игровые события</h3>
          ${p.logs.events.slice(0, 30).map((n) => `<div class="feed-item ${n.type}"><div>${n.text}</div><div class="t">${new Date(n.ts).toLocaleString("ru-RU")}</div>${n.target ? `<button data-go="${n.target}">Перейти</button>` : ""}${n.action ? `<button data-do="${n.action}">Выполнить</button>` : ""}</div>`).join("") || "<small class='note'>Пока пусто.</small>"}

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
    body += `<h4>Продукты в холодильнике</h4>${food.length ? food.map((f) => `<div class='mini-row'>${f.name} — срок ${Math.max(0, f.daysLeft).toFixed(1)} дн., цена ${f.price} €, питательность ${f.nutrition}</div>`).join("") : "<small>Пусто.</small>"}`;
  }

  return `<div class="modal-backdrop" data-closemodal="1"><div class="modal" onclick="event.stopPropagation()"><h3>${item.name}</h3>${body}<div class="row"><button data-closemodal="1">Закрыть</button></div></div></div>`;
}

function actionBtn(title, desc, key, minutes) {
  return `<div class="action-item"><div><b>${title}</b><div style="color:var(--muted);font-size:13px">${desc}</div><small>Время: ${minutes >= 60 ? `${Math.floor(minutes / 60)} ч ${minutes % 60} мин` : `${minutes} мин`}</small></div><button data-do="${key}">Выполнить</button></div>`;
}

function renderLocationActions(p) {
  const job = JOBS[p.career.currentJobId];
  if (p.location === "home") {
    return [
      actionBtn("Сон (8 часов)", "Оптимальное восстановление параметров.", "sleep8", 8 * 60),
      actionBtn("Сон (2 часа)", "Быстрый отдых, слабый эффект.", "sleep2", 2 * 60),
      actionBtn("Принять душ", "+гигиена, -стресс", "shower", 15),
      actionBtn("Почистить зубы", "+гигиена, +настроение", "teeth", 6),
      actionBtn("Поесть", "Съесть продукт из запасов.", "eat", 20),
      actionBtn("Помыть посуду", "Небольшой рост комфорта.", "dishes", 12),
      actionBtn("Тренировка", "+здоровье, -стресс, -энергия", "workout", 45),
      actionBtn("Прогулка", "+настроение, +здоровье", "walk", 40),
    ].join("");
  }

  if (p.location === "work") {
    return [
      `<div class="job-status"><b>${job.name}</b><div>Накоплено к выплате: <b>${fmtMoney(p.career.accruedSalary)} €</b></div><div>До выплаты: <b>${daysToSalary(p)} дн.</b></div><div>Репутация: ${p.career.rep[p.career.currentJobId]} | Уровень: ${p.career.levels[p.career.currentJobId]}</div></div>`,
      actionBtn("Работать 2 часа", "Опыт и накопление к месячной зарплате.", "work2", 2 * 60),
      actionBtn("Работать 8 часов", "Основная смена.", "work8", 8 * 60),
      actionBtn("Подать на повышение", "Шанс получить +1 уровень.", "promotion", 30),
    ].join("");
  }

  if (p.location === "shops") {
    const groceries = SHOP_ITEMS.groceries.map((g) => actionBtn(`Купить: ${g.name} (${g.price} €)`, `Питательность ${g.nutrition}, срок ${g.shelfDays} дн.`, `buyFood:${g.id}`, 15)).join("");
    const appliances = SHOP_ITEMS.appliances.map((it) => actionBtn(`Техника: ${it.name} (${it.price} €)`, `Комфорт +${it.comfort || 0}`, `buyAppliance:${it.id}`, 25)).join("");
    const homeGoods = SHOP_ITEMS.home.map((it) => actionBtn(`Для дома: ${it.name} (${it.price} €)`, `Комфорт +${it.comfort || 0}`, `buyHome:${it.id}`, 20)).join("");
    return `<h4>Продукты</h4>${groceries}<h4>Бытовая техника</h4>${appliances}<h4>Всё для дома</h4>${homeGoods}`;
  }

  if (p.location === "utilities") {
    const u = p.utilities;
    return `
    <div class="utility-card">
      <div><b>Вода</b>: расход ${u.water.consumed.toFixed(1)} м³, долг ${fmtMoney(u.water.debt)} €, статус: ${u.water.active ? "активно" : "отключено"}, просрочка ${u.water.overdueDays} дн.</div>
      <div><b>Электричество</b>: расход ${u.power.consumed.toFixed(1)} кВт·ч, долг ${fmtMoney(u.power.debt)} €, статус: ${u.power.active ? "активно" : "отключено"}, просрочка ${u.power.overdueDays} дн.</div>
      <div><b>Аренда</b>: долг ${fmtMoney(u.rent.debt)} €, статус договора: ${u.rent.active ? "активно" : "остановлено"}, просрочка ${u.rent.overdueDays} дн.</div>
    </div>
    ${actionBtn("Оплатить воду", "Погашение полного долга по воде.", "payWater", 8)}
    ${actionBtn("Оплатить электричество", "Погашение полного долга по электроснабжению.", "payPower", 8)}
    ${actionBtn("Оплатить аренду", "Погашение долга по аренде.", "payRent", 8)}
    ${actionBtn("Оплатить всё", "Погашение всех задолженностей.", "payAllUtilities", 12)}`;
  }

  if (p.location === "bank") {
    return [
      actionBtn("Взять кредит 1000 €", "Годовая ставка 18%.", "takeCredit", 15),
      actionBtn("Погасить кредит 500 €", "Списывает из долга.", "payCredit", 10),
      actionBtn("Открыть вклад 500 €", "Годовая ставка 8%.", "openDeposit", 10),
      actionBtn("Закрыть вклад", "Возврат вклада на баланс.", "closeDeposit", 10),
    ].join("");
  }

  if (p.location === "jobs") {
    return Object.entries(JOBS).map(([id, j]) => {
      const lvl = p.career.levels[id];
      const rep = p.career.rep[id];
      return `<div class="action-item"><div><b>${j.name}</b><div style="color:var(--muted);font-size:13px">Уровень ${lvl}, репутация ${rep}, тип: ${j.mode}${j.shift ? `, график: ${j.shift}` : ""}</div></div><button data-job="${id}">Выбрать</button></div>`;
    }).join("");
  }

  if (p.location === "clinic") {
    return [
      actionBtn("Поликлиника (200 €)", "+здоровье, -стресс, медленно.", "clinic", 60),
      actionBtn("Больница (900 €)", "Сильное восстановление.", "hospital", 150),
    ].join("");
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

  if (rawKey.startsWith("buyFood:")) {
    const id = rawKey.split(":")[1];
    const f = SHOP_ITEMS.groceries.find((x) => x.id === id);
    if (!f) return;
    if (p.money < f.price) return pushEvent(p, "Недостаточно денег.", "critical");
    p.money -= f.price;
    const hasFridge = p.housing.items.some((i) => i.id === "fridge");
    const storage = f.fridgePreferred && hasFridge ? "fridge" : "pantry";
    p.food.stock.push(makeFoodItem(f, storage));
    advanceGameMinutes(p, 15, `Покупка продукта: ${f.name}`);
    pushEvent(p, `Куплено: ${f.name}. Размещение: ${storage === "fridge" ? "холодильник" : "полка"}.`, "info", "home");
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

  switch (rawKey) {
    case "sleep8":
      advanceGameMinutes(p, 8 * 60, "Сон 8 часов");
      shiftStat(p, "energy", 330);
      shiftStat(p, "stress", -180);
      shiftStat(p, "health", 40);
      break;
    case "sleep2":
      advanceGameMinutes(p, 2 * 60, "Сон 2 часа");
      shiftStat(p, "energy", 95);
      shiftStat(p, "stress", -35);
      break;
    case "shower":
      advanceGameMinutes(p, 15, "Душ");
      shiftStat(p, "hygiene", 160);
      shiftStat(p, "stress", -40);
      consumeUtilitiesForAction(p, { waterUse: 0.12, powerUse: 0.05 });
      break;
    case "teeth":
      advanceGameMinutes(p, 6, "Чистка зубов");
      shiftStat(p, "hygiene", 80);
      shiftStat(p, "mood", 20);
      consumeUtilitiesForAction(p, { waterUse: 0.02 });
      break;
    case "eat": {
      const food = p.food.stock[0];
      if (!food) return pushEvent(p, "Нет продуктов. Сходите в магазин.", "critical", "shops");
      p.food.stock.shift();
      advanceGameMinutes(p, 20, `Приём пищи: ${food.name}`);
      shiftStat(p, "hunger", food.satiety);
      shiftStat(p, "mood", Math.round(food.nutrition / 6));
      break;
    }
    case "dishes": {
      advanceGameMinutes(p, 12, "Мытьё посуды");
      shiftStat(p, "comfort", 10);
      shiftStat(p, "hygiene", 20);
      const hasDishwasher = p.housing.items.some((i) => i.id === "dishwasher");
      consumeUtilitiesForAction(p, { waterUse: hasDishwasher ? 0.03 : 0.08, powerUse: hasDishwasher ? 0.02 : 0 });
      break;
    }
    case "workout":
      advanceGameMinutes(p, 45, "Тренировка дома");
      shiftStat(p, "health", 35);
      shiftStat(p, "stress", -35);
      shiftStat(p, "energy", -90);
      shiftStat(p, "hunger", -60);
      break;
    case "walk":
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
      const rep = p.career.rep[jobId];
      const chance = 0.18 + rep / 6000;
      if (Math.random() < chance && p.career.levels[jobId] < 10) {
        p.career.levels[jobId] += 1;
        pushEvent(p, `Повышение! ${JOBS[jobId].name} уровень ${p.career.levels[jobId]}.`, "info", "work");
      } else {
        shiftStat(p, "mood", -20);
        pushEvent(p, "В повышении отказано. Попробуйте позже.", "info", "work");
      }
      break;
    }
    case "takeCredit":
      advanceGameMinutes(p, 15, "Оформление кредита");
      p.bank.credit += 1000;
      p.money += 1000;
      pushEvent(p, "Кредит оформлен: +1000 €.", "info", "bank");
      break;
    case "payCredit":
      if (p.bank.credit <= 0) return;
      if (p.money < 500) return pushEvent(p, "Недостаточно денег для погашения.", "critical");
      advanceGameMinutes(p, 10, "Погашение кредита");
      p.money -= 500;
      p.bank.credit = Math.max(0, p.bank.credit - 500);
      break;
    case "openDeposit":
      if (p.money < 500) return pushEvent(p, "Недостаточно денег.", "critical");
      advanceGameMinutes(p, 10, "Открытие вклада");
      p.money -= 500;
      p.bank.deposit += 500;
      break;
    case "closeDeposit":
      if (p.bank.deposit <= 0) return;
      advanceGameMinutes(p, 10, "Закрытие вклада");
      p.money += p.bank.deposit;
      p.bank.deposit = 0;
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
  const jobId = p.career.currentJobId;
  const job = JOBS[jobId];

  advanceGameMinutes(p, hours * 60, `Работа (${hours} ч)`);
  const lvl = p.career.levels[jobId];
  const efficiency = (p.stats.energy * 0.28 + (1000 - p.stats.stress) * 0.24 + p.stats.hygiene * 0.16 + p.stats.mood * 0.16 + p.stats.health * 0.16) / 1000;
  const accrued = Math.round(hours * job.baseHourly * (1 + lvl * 0.07) * (0.7 + efficiency));
  p.career.accruedSalary += accrued;
  p.career.workedMinutesInMonth += hours * 60;
  p.career.rep[jobId] = clamp(p.career.rep[jobId] + Math.round(12 * efficiency - 2));
  shiftStat(p, "stress", job.stressPerHour * hours);
  shiftStat(p, "energy", -25 * hours);
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
    pushAction(p, `Переход в раздел: ${LOCATIONS.find((l) => l.id === p.location)?.label || p.location}.`);
    persistDB();
    render();
  });

  app.querySelectorAll("[data-do]").forEach((btn) => btn.onclick = () => doAction(btn.dataset.do));

  app.querySelectorAll("[data-job]").forEach((btn) => btn.onclick = () => {
    const p = getProfile();
    p.career.currentJobId = btn.dataset.job;
    pushEvent(p, `Выбрана работа: ${JOBS[btn.dataset.job].name}.`, "info", "work");
    persistDB();
    render();
  });

  app.querySelectorAll("[data-go]").forEach((btn) => btn.onclick = () => {
    const p = getProfile();
    p.location = btn.dataset.go;
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

  window.onscroll = () => {
    const topbar = document.getElementById("topbar");
    const stats = document.getElementById("statsBar");
    if (!topbar || !stats) return;
    const compact = window.scrollY > 20;
    topbar.classList.toggle("compact", compact);
    stats.classList.toggle("compact", compact);
  };
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
  render();
}, TICK_MS);

setInterval(() => {
  persistDB();
}, 10000);

render();
