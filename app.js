const SAVE_KEY = "survive-life-v1";
const TICK_MS = 1000;
const DEFAULT_SPEED = 1;

const DIFFICULTIES = {
  easy: { label: "Легко", startMoney: 20000 },
  normal: { label: "Базово", startMoney: 10000 },
  hard: { label: "Сложно", startMoney: 5000 },
};

const JOBS = {
  courier: { name: "Курьер", mode: "flex", stressPerHour: 18, baseHourly: 11 },
  callcenter: { name: "Оператор колл-центра", mode: "fixed", stressPerHour: 12, baseHourly: 10, shift: "09:00–18:00" },
  warehouse: { name: "Помощник на складе", mode: "shift", stressPerHour: 16, baseHourly: 12, shift: "2/2 по 12ч" },
};

const LOCATIONS = [
  { id: "home", icon: "🏠", label: "Дом" },
  { id: "work", icon: "💼", label: "Работа" },
  { id: "shops", icon: "🛒", label: "Магазины" },
  { id: "bank", icon: "🏦", label: "Банк" },
  { id: "jobs", icon: "📄", label: "Рынок труда" },
  { id: "clinic", icon: "🏥", label: "Медицина" },
  { id: "admin", icon: "⚙️", label: "Админ" },
];

let db = loadDB();
let currentProfileId = db.lastProfileId || null;
let popupTimeout = null;

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
      water: { active: true, dueMissedMonths: 0 },
      power: { active: true, dueMissedMonths: 0 },
      rent: { active: true, dueMissedMonths: 0 },
    },
    expenses: { transitPass: false },
    food: {
      stock: [
        { id: "apple", name: "Яблоко", satiety: 80, daysLeft: 5, fridgePreferred: false },
        { id: "milk", name: "Молоко", satiety: 120, daysLeft: 3, fridgePreferred: true },
      ],
    },
    housing: {
      items: [
        { id: "mattress", name: "Матрас", wear: 120, comfort: 20 },
        { id: "lightbulb", name: "Лампочка", wear: 100, comfort: 5 },
        { id: "sink", name: "Раковина", wear: 80, comfort: 10 },
        { id: "shower", name: "Душевая кабина", wear: 70, comfort: 15 },
      ],
      hasFridge: false,
    },
    career: {
      currentJobId: "courier",
      levels: { courier: 1, callcenter: 1, warehouse: 1 },
      rep: { courier: 500, callcenter: 400, warehouse: 400 },
      workedMinutesInMonth: 0,
      lastSalaryMonthKey: monthKey(now),
    },
    bank: {
      credit: 0,
      deposit: 0,
    },
    notifications: [],
    reminders: [],
    admin: {
      inflationMonthly: 0.01,
      randomEventsPerDayMin: 1,
      randomEventsPerDayMax: 3,
    },
    meta: { createdAt: now.toISOString(), updatedAt: now.toISOString() },
  };
  db.lastProfileId = id;
  currentProfileId = id;
  pushNotice(getProfile(), `Профиль «${name}» создан. Старт: €${fmtMoney(getProfile().money)}.`, "info");
  persistDB();
}

function getProfile() {
  return currentProfileId ? db.profiles[currentProfileId] : null;
}

function monthKey(d) {
  const date = new Date(d);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function clamp(v, min = 0, max = 1000) {
  return Math.max(min, Math.min(max, v));
}

function fmtMoney(v) {
  return Number(v).toLocaleString("ru-RU");
}

function shiftStat(p, key, delta) {
  p.stats[key] = clamp(Math.round(p.stats[key] + delta));
}

function pushNotice(profile, text, type = "info") {
  profile.notifications.unshift({ id: `n-${Date.now()}-${Math.random()}`, text, type, ts: profile.gameTime, read: false });
  profile.notifications = profile.notifications.slice(0, 180);
  profile.meta.updatedAt = new Date().toISOString();
  if (type === "critical") showPopup(text);
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

function applyMinuteTick(profile) {
  const gt = new Date(profile.gameTime);
  gt.setUTCMinutes(gt.getUTCMinutes() + profile.speed);
  const prevMonth = monthKey(profile.gameTime);
  profile.gameTime = gt.toISOString();

  shiftStat(profile, "hunger", -0.38 * profile.speed);
  shiftStat(profile, "energy", -0.27 * profile.speed);
  shiftStat(profile, "hygiene", -0.2 * profile.speed);
  shiftStat(profile, "stress", 0.12 * profile.speed);
  shiftStat(profile, "mood", -0.06 * profile.speed + profile.stats.comfort / 3500);

  if (profile.stats.energy < 200) {
    shiftStat(profile, "health", -0.15 * profile.speed);
  }
  if (profile.stats.hunger < 180) {
    shiftStat(profile, "health", -0.2 * profile.speed);
    shiftStat(profile, "stress", 0.3 * profile.speed);
  }
  if (profile.stats.hygiene < 220) {
    shiftStat(profile, "mood", -0.2 * profile.speed);
    shiftStat(profile, "health", -0.08 * profile.speed);
  }

  if (monthKey(profile.gameTime) !== prevMonth) {
    processMonthChange(profile, prevMonth);
  }

  maybeTriggerRandomEvent(profile);
}

function processMonthChange(profile) {
  const utilityCost = 700 + Math.round((1000 - profile.stats.comfort) * 0.15);
  const rent = 1800;
  const total = utilityCost + rent;

  if (profile.money >= total) {
    profile.money -= total;
    Object.values(profile.utilities).forEach(u => u.dueMissedMonths = 0);
    pushNotice(profile, `Списаны ежемесячные платежи: €${fmtMoney(total)}.`, "info");
  } else {
    Object.entries(profile.utilities).forEach(([key, u]) => {
      u.dueMissedMonths += 1;
      if (u.dueMissedMonths >= 1) {
        u.active = false;
        pushNotice(profile, `${labelUtility(key)} отключено из-за неуплаты.`, "critical");
      }
    });
  }

  const c = profile.career;
  const gt = new Date(profile.gameTime);
  const workedHours = c.workedMinutesInMonth / 60;
  const lvl = c.levels[c.currentJobId];
  const salary = Math.round(1200 + workedHours * JOBS[c.currentJobId].baseHourly * (1 + lvl * 0.08));
  profile.money += salary;
  c.workedMinutesInMonth = 0;
  c.lastSalaryMonthKey = monthKey(gt);
  pushNotice(profile, `Начислена зарплата: €${fmtMoney(salary)}.`, "info");

  if (profile.bank.deposit > 0) {
    const gain = Math.round(profile.bank.deposit * (0.08 / 12));
    profile.bank.deposit += gain;
    pushNotice(profile, `Вклад принёс €${fmtMoney(gain)}.`, "info");
  }
  if (profile.bank.credit > 0) {
    const fee = Math.round(profile.bank.credit * (0.18 / 12));
    profile.bank.credit += fee;
    pushNotice(profile, `Начислены проценты по кредиту: €${fmtMoney(fee)}.`, "info");
  }
}

function labelUtility(k) {
  return ({ water: "Водоснабжение", power: "Электроснабжение", rent: "Договор аренды" })[k] || k;
}

function maybeTriggerRandomEvent(profile) {
  if (Math.random() > 0.004 * profile.speed) return;
  const events = [
    () => {
      const bonus = 250 + Math.round(Math.random() * 350);
      profile.money += bonus;
      pushNotice(profile, `Премия на работе: +€${fmtMoney(bonus)}.`, "info");
    },
    () => {
      shiftStat(profile, "health", -90);
      shiftStat(profile, "stress", 110);
      pushNotice(profile, "Вы простудились. Здоровье снизилось, стресс вырос.", "critical");
    },
    () => {
      shiftStat(profile, "mood", 120);
      shiftStat(profile, "stress", -90);
      pushNotice(profile, "Приятное событие дня подняло настроение.", "info");
    },
    () => {
      pushNotice(profile, "В магазине действует акция на продукты до конца дня.", "info");
    }
  ];
  events[Math.floor(Math.random() * events.length)]();
}

function render() {
  const app = document.getElementById("app");
  const p = getProfile();
  app.innerHTML = p ? gameMarkup(p) : authMarkup();
  bindHandlers();
}

function authMarkup() {
  const list = Object.values(db.profiles).map(p => `<option value="${p.id}">${p.name} — ${DIFFICULTIES[p.difficulty].label}</option>`).join("");
  return `
  <div class="auth-shell">
    <div class="card">
      <h1 class="auth-title">Survive Life</h1>
      <p class="auth-sub">Создайте профиль игрока или войдите в существующий. Каждый профиль хранит отдельное сохранение.</p>

      <div class="row">
        <input id="newProfileName" type="text" placeholder="Имя профиля" maxlength="24" />
        <select id="difficulty">
          <option value="easy">Легко (€20 000)</option>
          <option value="normal" selected>Базово (€10 000)</option>
          <option value="hard">Сложно (€5 000)</option>
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
      <small class="note">Автосохранение включено. Формат валюты: число + знак в конце (например: 12 345 €).</small>
    </div>
  </div>`;
}

function statLine(name, value) {
  const pct = Math.round((value / 1000) * 100);
  const color = pct < 20 ? "var(--danger)" : pct < 45 ? "#d59012" : "var(--ok)";
  return `<div class="stat"><div class="stat-head"><span>${name}</span><b>${value}</b></div><div class="bar"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div></div>`;
}

function gameMarkup(p) {
  const gt = new Date(p.gameTime);
  const loc = LOCATIONS.find(l => l.id === p.location)?.label || p.location;
  return `
  <div class="game">
    <aside class="sidebar">
      ${LOCATIONS.map(l => `<button class="${l.id === p.location ? "active" : ""}" data-nav="${l.id}">${l.icon}</button>`).join("")}
    </aside>

    <main class="main">
      <section class="topbar">
        <div class="meta">
          <span>Профиль: <b>${p.name}</b></span>
          <span>Время: <b>${gt.toLocaleString("ru-RU")}</b></span>
          <span>Локация: <b>${loc}</b></span>
          <span>Деньги: <b>${fmtMoney(p.money)} €</b></span>
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

      <section class="stats">
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
        </section>

        <section class="feed">
          <h3 style="margin-top:0">Лента уведомлений</h3>
          ${p.notifications.slice(0, 40).map(n => `<div class="feed-item"><div>${n.text}</div><div class="t">${new Date(n.ts).toLocaleString("ru-RU")}</div></div>`).join("") || "<small class='note'>Пока пусто.</small>"}
        </section>
      </section>
    </main>
  </div>`;
}

function actionBtn(title, desc, key) {
  return `<div class="action-item"><div><b>${title}</b><div style="color:var(--muted);font-size:13px">${desc}</div></div><button data-do="${key}">Выполнить</button></div>`;
}

function renderLocationActions(p) {
  switch (p.location) {
    case "home":
      return [
        actionBtn("Сон (8 часов)", "Оптимальное восстановление параметров.", "sleep8"),
        actionBtn("Сон (2 часа)", "Быстрый отдых, слабый эффект.", "sleep2"),
        actionBtn("Принять душ", "+гигиена, -стресс", "shower"),
        actionBtn("Почистить зубы", "+гигиена, +настроение", "teeth"),
        actionBtn("Поесть", "Съесть первый доступный продукт.", "eat"),
        actionBtn("Помыть посуду", "Небольшой рост комфорта.", "dishes"),
        actionBtn("Тренировка", "+здоровье, -стресс, -энергия", "workout"),
        actionBtn("Прогулка", "+настроение, +здоровье", "walk"),
      ].join("");
    case "work":
      return [
        actionBtn("Работать 2 часа", "Доход + опыт + репутация.", "work2"),
        actionBtn("Работать 8 часов", "Основная смена.", "work8"),
        actionBtn("Подать на повышение", "Шанс получить +1 уровень по текущей работе.", "promotion"),
      ].join("");
    case "shops":
      return [
        actionBtn("Купить продукты (€120)", "Добавляет 1 продукт в запас.", "buyFood"),
        actionBtn("Купить холодильник (€2400)", "Увеличивает срок хранения.", "buyFridge"),
        actionBtn("Купить декор (€550)", "+комфорт жилья.", "buyDecor"),
      ].join("");
    case "bank":
      return [
        actionBtn("Взять кредит €1000", "Годовая ставка 18%.", "takeCredit"),
        actionBtn("Погасить кредит €500", "Списывает из долга при наличии денег.", "payCredit"),
        actionBtn("Открыть вклад €500", "Годовая ставка 8%.", "openDeposit"),
        actionBtn("Закрыть вклад", "Возврат вклада на баланс.", "closeDeposit"),
      ].join("");
    case "jobs":
      return Object.entries(JOBS).map(([id, j]) => {
        const lvl = p.career.levels[id];
        const rep = p.career.rep[id];
        return `<div class="action-item"><div><b>${j.name}</b><div style="color:var(--muted);font-size:13px">Уровень ${lvl}, репутация ${rep}, тип: ${j.mode}</div></div><button data-job="${id}">Выбрать</button></div>`;
      }).join("");
    case "clinic":
      return [
        actionBtn("Поликлиника (€200)", "+здоровье, -стресс, медленно.", "clinic"),
        actionBtn("Больница (€900)", "Сильное восстановление.", "hospital"),
      ].join("");
    case "admin":
      return `<div class="action-item"><div><b>Сброс админ-настроек</b><div style="color:var(--muted);font-size:13px">Инфляция 1%, события 1-3/день.</div></div><button data-do="adminReset">Сброс</button></div>`;
    default:
      return "";
  }
}

function applyHours(profile, hours) {
  const mins = hours * 60;
  const prev = profile.speed;
  profile.speed = 1;
  for (let i = 0; i < mins; i++) applyMinuteTick(profile);
  profile.speed = prev;
}

function doAction(key) {
  const p = getProfile();
  if (!p) return;
  switch (key) {
    case "sleep8":
      applyHours(p, 8);
      shiftStat(p, "energy", 330);
      shiftStat(p, "stress", -180);
      shiftStat(p, "health", 40);
      pushNotice(p, "Вы хорошо выспались 8 часов.", "info");
      break;
    case "sleep2":
      applyHours(p, 2);
      shiftStat(p, "energy", 95);
      shiftStat(p, "stress", -35);
      pushNotice(p, "Короткий сон завершен.", "info");
      break;
    case "shower":
      shiftStat(p, "hygiene", 160);
      shiftStat(p, "stress", -40);
      pushNotice(p, "Душ принят.", "info");
      break;
    case "teeth":
      shiftStat(p, "hygiene", 80);
      shiftStat(p, "mood", 20);
      break;
    case "eat": {
      const food = p.food.stock.shift();
      if (!food) return pushNotice(p, "Нет продуктов. Сходите в магазин.", "critical");
      shiftStat(p, "hunger", food.satiety);
      shiftStat(p, "mood", 10);
      pushNotice(p, `Вы съели: ${food.name}.`, "info");
      break;
    }
    case "dishes":
      shiftStat(p, "comfort", 10);
      shiftStat(p, "hygiene", 20);
      break;
    case "workout":
      shiftStat(p, "health", 35);
      shiftStat(p, "stress", -35);
      shiftStat(p, "energy", -90);
      shiftStat(p, "hunger", -60);
      break;
    case "walk":
      shiftStat(p, "mood", 45);
      shiftStat(p, "health", 20);
      shiftStat(p, "stress", -25);
      break;
    case "work2":
      doWorkHours(2);
      break;
    case "work8":
      doWorkHours(8);
      break;
    case "promotion": {
      const jobId = p.career.currentJobId;
      const rep = p.career.rep[jobId];
      const chance = 0.18 + rep / 6000;
      if (Math.random() < chance && p.career.levels[jobId] < 10) {
        p.career.levels[jobId] += 1;
        pushNotice(p, `Повышение! ${JOBS[jobId].name} уровень ${p.career.levels[jobId]}.`, "info");
      } else {
        shiftStat(p, "mood", -20);
        pushNotice(p, "В повышении отказано. Попробуйте позже.", "info");
      }
      break;
    }
    case "buyFood":
      if (p.money < 120) return pushNotice(p, "Недостаточно денег.", "critical");
      p.money -= 120;
      p.food.stock.push({ id: "groceries", name: "Продукты", satiety: 140, daysLeft: 4, fridgePreferred: true });
      pushNotice(p, "Куплен набор продуктов.", "info");
      break;
    case "buyFridge":
      if (p.housing.hasFridge) return;
      if (p.money < 2400) return pushNotice(p, "Недостаточно денег.", "critical");
      p.money -= 2400;
      p.housing.hasFridge = true;
      shiftStat(p, "comfort", 70);
      pushNotice(p, "Покупка: холодильник установлен.", "info");
      break;
    case "buyDecor":
      if (p.money < 550) return pushNotice(p, "Недостаточно денег.", "critical");
      p.money -= 550;
      shiftStat(p, "comfort", 45);
      shiftStat(p, "mood", 35);
      break;
    case "takeCredit":
      p.bank.credit += 1000;
      p.money += 1000;
      pushNotice(p, "Кредит оформлен: €1000.", "info");
      break;
    case "payCredit":
      if (p.bank.credit <= 0) return;
      if (p.money < 500) return pushNotice(p, "Недостаточно денег для погашения.", "critical");
      p.money -= 500;
      p.bank.credit = Math.max(0, p.bank.credit - 500);
      break;
    case "openDeposit":
      if (p.money < 500) return pushNotice(p, "Недостаточно денег.", "critical");
      p.money -= 500;
      p.bank.deposit += 500;
      break;
    case "closeDeposit":
      if (p.bank.deposit <= 0) return;
      p.money += p.bank.deposit;
      p.bank.deposit = 0;
      pushNotice(p, "Вклад закрыт, средства возвращены.", "info");
      break;
    case "clinic":
      if (p.money < 200) return pushNotice(p, "Недостаточно денег.", "critical");
      p.money -= 200;
      shiftStat(p, "health", 130);
      shiftStat(p, "stress", -50);
      break;
    case "hospital":
      if (p.money < 900) return pushNotice(p, "Недостаточно денег.", "critical");
      p.money -= 900;
      shiftStat(p, "health", 320);
      shiftStat(p, "stress", -120);
      break;
    case "adminReset":
      p.admin.inflationMonthly = 0.01;
      p.admin.randomEventsPerDayMin = 1;
      p.admin.randomEventsPerDayMax = 3;
      pushNotice(p, "Админ-параметры сброшены к значениям по умолчанию.", "info");
      break;
    default:
      break;
  }
  p.meta.updatedAt = new Date().toISOString();
  persistDB();
  render();
}

function doWorkHours(hours) {
  const p = getProfile();
  const jobId = p.career.currentJobId;
  const job = JOBS[jobId];

  applyHours(p, hours);
  const lvl = p.career.levels[jobId];
  const efficiency = (p.stats.energy * 0.28 + (1000 - p.stats.stress) * 0.24 + p.stats.hygiene * 0.16 + p.stats.mood * 0.16 + p.stats.health * 0.16) / 1000;
  const pay = Math.round(hours * job.baseHourly * (1 + lvl * 0.07) * (0.7 + efficiency));
  p.money += pay;
  p.career.workedMinutesInMonth += hours * 60;
  p.career.rep[jobId] = clamp(p.career.rep[jobId] + Math.round(12 * efficiency - 2));
  shiftStat(p, "stress", job.stressPerHour * hours);
  shiftStat(p, "energy", -25 * hours);
  shiftStat(p, "hunger", -20 * hours);
  pushNotice(p, `Работа (${hours} ч): +€${fmtMoney(pay)}.`, "info");

  if (Math.random() < 0.07 && job.mode === "fixed") {
    p.career.rep[jobId] = clamp(p.career.rep[jobId] - 40);
    pushNotice(p, "Отмечен прогул в фиксированном графике: падение репутации.", "critical");
  }
}

function bindHandlers() {
  const app = document.getElementById("app");

  app.querySelectorAll("[data-action='createProfile']").forEach(btn => btn.onclick = () => {
    const name = document.getElementById("newProfileName").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    if (!name) return alert("Введите имя профиля");
    createProfile(name, difficulty);
    render();
  });

  app.querySelectorAll("[data-action='enterProfile']").forEach(btn => btn.onclick = () => {
    const id = document.getElementById("existingProfile").value;
    if (!id || !db.profiles[id]) return;
    currentProfileId = id;
    db.lastProfileId = id;
    persistDB();
    render();
  });

  app.querySelectorAll("[data-action='logout']").forEach(btn => btn.onclick = () => {
    currentProfileId = null;
    persistDB();
    render();
  });

  app.querySelectorAll("[data-nav]").forEach(btn => btn.onclick = () => {
    const p = getProfile();
    p.location = btn.dataset.nav;
    persistDB();
    render();
  });

  app.querySelectorAll("[data-do]").forEach(btn => btn.onclick = () => doAction(btn.dataset.do));

  app.querySelectorAll("[data-job]").forEach(btn => btn.onclick = () => {
    const p = getProfile();
    p.career.currentJobId = btn.dataset.job;
    pushNotice(p, `Вы выбрали работу: ${JOBS[btn.dataset.job].name}.`, "info");
    persistDB();
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

  app.querySelectorAll("[data-action='exportProfile']").forEach(btn => btn.onclick = () => {
    const p = getProfile();
    downloadJSON(`${p.name}-save.json`, p);
  });

  app.querySelectorAll("[data-action='exportAll']").forEach(btn => btn.onclick = () => {
    downloadJSON(`survive-life-profiles.json`, db);
  });

  app.querySelectorAll("[data-action='importSave']").forEach(btn => btn.onclick = () => {
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
