// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: calendar-alt;

// USOS Widget for iPhone — your USOS timetable on the home screen and lock screen.
// https://github.com/ProstoKery/usos-widget-ios
//
// Run this script once in Scriptable: it asks for your USOS link
// (USOSweb → Mój USOSweb → Plan zajęć → Eksportuj) and shows your classes.
// Then add a Scriptable widget and pick "USOS Widget".
// Small widget = next class, medium / large = timetable.
// Widget parameter (optional): "next" or "list".

const VERSION = "1.0.0";
const LINK_KEY = "usos-widget-link";

// ---------- texts (follow the phone language: pl / en / uk / ru) ----------
const T = {
  en: {
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], today: "Today", tomorrow: "Tomorrow",
    tomorrowAt: t => `tomorrow ${t}`, until: t => `until ${t}`, now: "now", updated: t => `upd. ${t}`,
    timetable: "Timetable", noClasses: "No classes", loading: "Loading…",
    noConnection: "No connection to USOS", notCalendar: "The link is not a USOS calendar",
    changesTitle: n => `Timetable changes (${n})`, added: (a, b) => `New: ${a} — ${b}`,
    moved: (a, b, c) => `Moved: ${a} — was ${b}, now ${c}`, cancelled: (a, b) => `Cancelled: ${a} — ${b}`,
    upcoming: "Upcoming classes",
    askTitle: "Your USOS link",
    askMessage: "USOSweb → Mój USOSweb → Plan zajęć → Eksportuj. Copy the link and paste it here.",
    save: "Save", cancel: "Cancel", changeLink: "🔗 Change USOS link", badLink: "This is not a link. Copy it again from USOSweb.",
    noLinkTitle: "USOS Widget", noLinkWidget: "Tap and paste your USOS link",
    howToWidget: "➕ How to add the widget", howToWidgetText: "Home screen → hold an empty spot → Edit → Add Widget → Scriptable → pick a size → Add Widget. Then hold the widget → Edit Widget → Script: USOS Widget.",
  },
  pl: {
    days: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"], today: "Dziś", tomorrow: "Jutro",
    tomorrowAt: t => `jutro ${t}`, until: t => `do ${t}`, now: "teraz", updated: t => `akt. ${t}`,
    timetable: "Plan zajęć", noClasses: "Brak zajęć", loading: "Ładowanie…",
    noConnection: "Brak połączenia z USOS", notCalendar: "To nie jest link do planu z USOS",
    changesTitle: n => `Zmiany w planie (${n})`, added: (a, b) => `Nowe: ${a} — ${b}`,
    moved: (a, b, c) => `Przeniesione: ${a} — było ${b}, teraz ${c}`, cancelled: (a, b) => `Odwołane: ${a} — ${b}`,
    upcoming: "Najbliższe zajęcia",
    askTitle: "Twój link z USOS",
    askMessage: "USOSweb → Mój USOSweb → Plan zajęć → Eksportuj. Skopiuj link i wklej go tutaj.",
    save: "Zapisz", cancel: "Anuluj", changeLink: "🔗 Zmień link z USOS", badLink: "To nie jest link. Skopiuj go ponownie z USOSweb.",
    noLinkTitle: "USOS Widget", noLinkWidget: "Dotknij i wklej link z USOS",
    howToWidget: "➕ Jak dodać widżet", howToWidgetText: "Ekran główny → przytrzymaj puste miejsce → Edytuj → Dodaj widżet → Scriptable → wybierz rozmiar → Dodaj widżet. Potem przytrzymaj widżet → Edytuj widżet → Script: USOS Widget.",
  },
  uk: {
    days: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], today: "Сьогодні", tomorrow: "Завтра",
    tomorrowAt: t => `завтра ${t}`, until: t => `до ${t}`, now: "зараз", updated: t => `оновл. ${t}`,
    timetable: "Розклад", noClasses: "Пар немає", loading: "Завантаження…",
    noConnection: "Немає зв'язку з USOS", notCalendar: "Це не посилання на розклад з USOS",
    changesTitle: n => `Зміни в розкладі (${n})`, added: (a, b) => `Нова: ${a} — ${b}`,
    moved: (a, b, c) => `Перенесено: ${a} — було ${b}, тепер ${c}`, cancelled: (a, b) => `Скасовано: ${a} — ${b}`,
    upcoming: "Найближчі пари",
    askTitle: "Твоє посилання з USOS",
    askMessage: "USOSweb → Mój USOSweb → Plan zajęć → Eksportuj. Скопіюй посилання і встав сюди.",
    save: "Зберегти", cancel: "Скасувати", changeLink: "🔗 Змінити посилання USOS", badLink: "Це не посилання. Скопіюй його ще раз з USOSweb.",
    noLinkTitle: "USOS Widget", noLinkWidget: "Натисни і встав посилання з USOS",
    howToWidget: "➕ Як додати віджет", howToWidgetText: "Робочий стіл → утримуй порожнє місце → Редагувати → Додати віджет → Scriptable → обери розмір → Додати віджет. Потім утримуй віджет → Редагувати віджет → Script: USOS Widget.",
  },
  ru: {
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], today: "Сегодня", tomorrow: "Завтра",
    tomorrowAt: t => `завтра ${t}`, until: t => `до ${t}`, now: "сейчас", updated: t => `обн. ${t}`,
    timetable: "Расписание", noClasses: "Пар нет", loading: "Загрузка…",
    noConnection: "Нет связи с USOS", notCalendar: "Это не ссылка на расписание из USOS",
    changesTitle: n => `Изменения в расписании (${n})`, added: (a, b) => `Новая: ${a} — ${b}`,
    moved: (a, b, c) => `Перенос: ${a} — было ${b}, теперь ${c}`, cancelled: (a, b) => `Отменена: ${a} — ${b}`,
    upcoming: "Ближайшие пары",
    askTitle: "Твоя ссылка из USOS",
    askMessage: "USOSweb → Mój USOSweb → Plan zajęć → Eksportuj. Скопируй ссылку и вставь сюда.",
    save: "Сохранить", cancel: "Отмена", changeLink: "🔗 Изменить ссылку USOS", badLink: "Это не ссылка. Скопируй её ещё раз из USOSweb.",
    noLinkTitle: "USOS Widget", noLinkWidget: "Нажми и вставь ссылку из USOS",
    howToWidget: "➕ Как добавить виджет", howToWidgetText: "Рабочий стол → удерживай пустое место → Править → Добавить виджет → Scriptable → выбери размер → Добавить виджет. Потом удерживай виджет → Изменить виджет → Script: USOS Widget.",
  },
};
const LANG = (() => { try { return String(Device.language() || "en").slice(0, 2).toLowerCase(); } catch (e) { return "en"; } })();
const S = T[LANG] || T.en;

const C = {
  paper: new Color("#FCF5C7"),
  accentDark: new Color("#8A6D00"),
  ink: new Color("#1B1A3A"),
  muted: new Color("#5F5B4A"),
  warn: new Color("#B42318"),
  now: new Color("#C2410C"),
};
const MIN = 60 * 1000;
const DAY = 24 * 60 * MIN;
const MAX_AGE = 30 * MIN;

// ---------- storage (shared by the app and the widget) ----------
const fm = FileManager.local();
const STATE_PATH = fm.joinPath(fm.documentsDirectory(), "usos-widget-state.json");
function loadState() {
  try { if (fm.fileExists(STATE_PATH)) return JSON.parse(fm.readString(STATE_PATH)); } catch (e) {}
  return { lessons: [], scheduleAt: 0, scheduleErr: "" };
}
function saveState(s) { try { fm.writeString(STATE_PATH, JSON.stringify(s)); } catch (e) {} }
function getLink() { try { return Keychain.contains(LINK_KEY) ? Keychain.get(LINK_KEY) : ""; } catch (e) { return ""; } }
function setLink(v) { Keychain.set(LINK_KEY, v); }

// ---------- formatting ----------
const pad2 = n => String(n).padStart(2, "0");
const hm = ms => { const d = new Date(ms); return `${d.getHours()}:${pad2(d.getMinutes())}`; };
const dayKey = ms => { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
const dayShort = ms => { const d = new Date(ms); return `${S.days[d.getDay()]} ${d.getDate()}.${pad2(d.getMonth() + 1)}`; };
function dayHeader(ms, now) {
  const base = dayShort(ms).replace(" ", ", ");
  if (dayKey(ms) === dayKey(now)) return `${S.today} · ${base}`;
  if (dayKey(ms) === dayKey(now + DAY)) return `${S.tomorrow} · ${base}`;
  return base;
}
function whenText(l, now) {
  if (l.start <= now) return S.until(hm(l.end));
  if (dayKey(l.start) === dayKey(now)) return hm(l.start);
  if (dayKey(l.start) === dayKey(now + DAY)) return S.tomorrowAt(hm(l.start));
  return `${dayShort(l.start)} ${hm(l.start)}`;
}

// ---------- USOS calendar ----------
function extractLink(text) {
  const m = String(text || "").match(/(?:https?|webcal):\/\/[^\s"'<>]+/i);
  return m ? m[0] : "";
}

function parseIcs(text) {
  const lines = [];
  for (const l of text.split(/\r?\n/)) {
    if (!l) continue;
    if ((l[0] === " " || l[0] === "\t") && lines.length) lines[lines.length - 1] += l.slice(1);
    else lines.push(l);
  }
  const unescape = s => s.replace(/\\([nN,;\\])/g, (_, c) => (c === "n" || c === "N") ? "\n" : c);
  const toMs = value => {
    const m = value.trim().match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
    if (!m) return null;
    const [, y, mo, d, h = "0", mi = "0", se = "0", z] = m;
    if (z) return Date.UTC(+y, +mo - 1, +d, +h, +mi, +se);
    return new Date(+y, +mo - 1, +d, +h, +mi, +se).getTime(); // USOS sends Warsaw local time
  };
  const out = [];
  let ev = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { ev = {}; continue; }
    if (line === "END:VEVENT") {
      const start = ev && ev.DTSTART ? toMs(ev.DTSTART) : null;
      if (start != null && !/CANCELLED/i.test(ev.STATUS || "")) {
        const end = (ev.DTEND && toMs(ev.DTEND)) || start + 90 * MIN;
        const { title, detail } = describe(unescape(ev.SUMMARY || "").trim(), unescape(ev.DESCRIPTION || ""));
        out.push({ start, end, title, detail, uid: (ev.UID || "").trim() });
      }
      ev = null;
      continue;
    }
    if (!ev) continue;
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const name = line.slice(0, colon).split(";")[0].toUpperCase();
    if (!(name in ev)) ev[name] = line.slice(colon + 1);
  }
  return out.sort((a, b) => a.start - b.start);
}

// "W - Sztuczna Inteligencja; SPEC: …" + "Sala: 114 … gr_nr=1" → "Sztuczna Inteligencja" / "W, gr. 1 (114)"
function describe(summary, description) {
  let type = "", name = summary;
  const dash = summary.indexOf(" - ");
  if (dash >= 1 && dash <= 8 && !summary.slice(0, dash).includes(" ")) { type = summary.slice(0, dash).trim(); name = summary.slice(dash + 3); }
  name = name.split("; SPEC:")[0].trim();
  const roomM = description.match(/(?:Sala|Room):\s*([^\n]+)/); // Polish or English USOSweb
  const room = roomM ? roomM[1].replace(/\s*\(Comp\. Room\)/i, "").trim() : "";
  const grM = description.match(/gr_nr=(\d+)/);
  const parts = [];
  if (type) parts.push(type);
  if (grM) parts.push(`gr. ${grM[1]}`);
  let detail = parts.join(", ");
  if (room) detail = detail ? `${detail} (${room})` : room;
  return { title: name || summary, detail };
}

// Moved / cancelled / new classes in the next 7 days (by USOS meeting id).
function scheduleChanges(old, fresh, now) {
  const until = now + 7 * DAY;
  const inWin = l => l.uid && l.end > now && l.start < until;
  const oldById = new Map(old.filter(l => l.uid).map(l => [l.uid, l]));
  const freshIds = new Set(fresh.map(l => l.uid));
  const at = l => `${dayShort(l.start)} ${hm(l.start)}`;
  const out = [];
  for (const n of fresh.filter(inWin)) {
    const o = oldById.get(n.uid);
    if (!o) out.push(S.added(n.title, at(n)));
    else if (o.start !== n.start || o.end !== n.end) out.push(S.moved(n.title, at(o), at(n)));
    else if (o.detail !== n.detail) out.push(`${n.title} (${dayShort(n.start)}): ${o.detail} → ${n.detail}`);
  }
  for (const o of old.filter(inWin)) if (!freshIds.has(o.uid)) out.push(S.cancelled(o.title, at(o)));
  return out;
}

function runUrl() { try { return URLScheme.forRunningScript(); } catch (e) { return null; } }
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(16); }

async function refreshSchedule(state, link, force) {
  const now = Date.now();
  if (!link) return;
  if (!force && state.scheduleSource === link && now - state.scheduleAt < MAX_AGE && state.lessons.length) return;
  try {
    const req = new Request(link.replace(/^webcal:/i, "https:").replace(/^http:/i, "https:"));
    req.timeoutInterval = 20;
    const text = await req.loadString();
    if (!text.includes("BEGIN:VCALENDAR")) { state.scheduleErr = S.notCalendar; return; }
    const fresh = parseIcs(text);
    const oldHasFuture = state.lessons.some(l => l.end > now);
    if (fresh.length === 0 && oldHasFuture) return; // a hiccup on the USOS side; keep the last timetable
    if (oldHasFuture && state.scheduleSource === link) {
      const changes = scheduleChanges(state.lessons, fresh, now);
      if (changes.length) {
        const n = new Notification();
        n.title = S.changesTitle(changes.length);
        n.body = changes.slice(0, 6).join("\n");
        n.identifier = "usos-widget-schedule-" + hash(changes.join("|")); // two widgets refreshing at once → one alert
        const url = runUrl();
        if (url) n.openURL = url;
        await n.schedule();
      }
    }
    state.lessons = fresh;
    state.scheduleSource = link;
    state.scheduleAt = now;
    state.scheduleErr = "";
  } catch (e) {
    state.scheduleErr = S.noConnection;
  }
}

// ---------- widgets ----------
function warning(state) { return !state.lessons.length && state.scheduleErr ? state.scheduleErr : null; }

function newWidget(top, bottom) {
  const w = new ListWidget();
  w.backgroundColor = C.paper;
  w.setPadding(top, 12, bottom, 12);
  const url = runUrl();
  if (url) w.url = url; // tapping the widget refreshes and opens the list
  return w;
}

function text(parent, value, font, color, lines) {
  const t = parent.addText(value);
  t.font = font;
  t.textColor = color;
  if (lines) t.lineLimit = lines;
  return t;
}

function buildNoLink() {
  const w = newWidget(12, 10);
  text(w, S.noLinkTitle, Font.boldSystemFont(14), C.ink, 2);
  w.addSpacer(4);
  text(w, S.noLinkWidget, Font.systemFont(12), C.muted, 3);
  return w;
}

function buildNext(state, now) {
  const w = newWidget(12, 10);
  const l = state.lessons.find(x => x.end > now);
  text(w, l ? l.title : (state.scheduleAt ? S.noClasses : S.loading), Font.boldSystemFont(14), C.ink, 2);
  w.addSpacer(2);
  text(w, l ? l.detail : "", Font.systemFont(12), C.muted, 1);
  w.addSpacer();
  const row = w.addStack();
  row.bottomAlignContent();
  text(row, warning(state) || "", Font.systemFont(10), C.warn, 2);
  row.addSpacer();
  text(row, l ? whenText(l, now) : "", Font.boldSystemFont(15), C.ink);
  return w;
}

function buildList(state, now, rows) {
  const w = newWidget(10, 8);
  const head = w.addStack();
  text(head, S.timetable, Font.boldSystemFont(15), C.ink);
  head.addSpacer();
  if (state.scheduleAt) text(head, S.updated(hm(state.scheduleAt)), Font.systemFont(10), C.muted);
  const warn = warning(state);
  if (warn) text(w, warn, Font.systemFont(11), C.warn);
  w.addSpacer(4);
  const upcoming = state.lessons.filter(l => l.end > now);
  if (!upcoming.length) text(w, state.scheduleAt ? S.noClasses : S.loading, Font.systemFont(13), C.muted);
  let used = 0, lastDay = "";
  for (const l of upcoming) {
    const key = dayKey(l.start);
    const needHeader = key !== lastDay;
    if (used + (needHeader ? 2 : 1) > rows) break;
    if (needHeader) {
      text(w, dayHeader(l.start, now), Font.boldSystemFont(11), C.accentDark);
      lastDay = key;
      used++;
    }
    const r = w.addStack();
    r.spacing = 6;
    const running = l.start <= now;
    text(r, running ? S.now : hm(l.start), Font.boldSystemFont(12), running ? C.now : C.ink);
    text(r, l.detail ? `${l.title} · ${l.detail}` : l.title, Font.systemFont(12), C.ink, 1);
    used++;
  }
  w.addSpacer();
  return w;
}

// Lock screen widgets (iOS 16+): plain text, the system picks the colours.
function buildAccessory(state, now, family) {
  const w = new ListWidget();
  const url = runUrl();
  if (url) w.url = url;
  const l = state.lessons.find(x => x.end > now);
  if (family === "accessoryInline") {
    w.addText(l ? `${whenText(l, now)} ${l.title}` : S.noClasses);
  } else if (family === "accessoryCircular") {
    w.addAccessoryWidgetBackground = true;
    const t = w.addText(l ? (l.start <= now ? hm(l.end) : hm(l.start)) : "—");
    t.font = Font.boldSystemFont(14);
    t.centerAlignText();
  } else {
    const a = w.addText(l ? l.title : S.noClasses);
    a.font = Font.boldSystemFont(13);
    a.lineLimit = 1;
    if (l) {
      const b = w.addText(`${whenText(l, now)} · ${l.detail}`);
      b.font = Font.systemFont(12);
      b.lineLimit = 2;
    }
  }
  return w;
}

function nextRefresh(state, now) {
  const times = state.lessons.flatMap(l => [l.start, l.end]).filter(t => t > now);
  const boundary = times.length ? Math.min(...times) + 1000 : now + 60 * MIN;
  return new Date(Math.min(boundary, now + MAX_AGE));
}

// ---------- in the app ----------
async function askForLink(current) {
  for (;;) {
    const a = new Alert();
    a.title = S.askTitle;
    a.message = S.askMessage;
    a.addTextField("https://usosapps.…/services/tt/upcoming_ical?…", current || "");
    a.addAction(S.save);
    a.addCancelAction(S.cancel);
    if ((await a.presentAlert()) === -1) return null;
    const link = extractLink(a.textFieldValue(0));
    if (link) return link;
    const e = new Alert();
    e.message = S.badLink;
    e.addAction("OK");
    await e.presentAlert();
  }
}

function fillTable(t, state, now) {
  t.removeAllRows();
  const head = new UITableRow();
  head.isHeader = true;
  head.addText(S.upcoming, state.scheduleErr || (state.scheduleAt ? S.updated(hm(state.scheduleAt)) : ""));
  t.addRow(head);
  const upcoming = state.lessons.filter(l => l.end > now).slice(0, 15);
  if (!upcoming.length) { const r = new UITableRow(); r.addText(state.scheduleErr || S.noClasses); t.addRow(r); }
  let lastDay = "";
  for (const l of upcoming) {
    if (dayKey(l.start) !== lastDay) {
      lastDay = dayKey(l.start);
      const d = new UITableRow();
      d.addText(dayHeader(l.start, now)).titleColor = C.accentDark;
      t.addRow(d);
    }
    const r = new UITableRow();
    r.height = 54;
    r.addText(`${l.start <= now ? S.now : hm(l.start)}  ${l.title}`, `${l.detail} · ${S.until(hm(l.end))}`);
    t.addRow(r);
  }
  const how = new UITableRow();
  how.height = 90;
  how.addText(S.howToWidget, S.howToWidgetText).subtitleFont = Font.systemFont(12);
  t.addRow(how);
  const change = new UITableRow();
  change.addText(S.changeLink);
  change.dismissOnSelect = false;
  change.onSelect = async () => {
    const link = await askForLink(getLink());
    if (!link) return;
    setLink(link);
    await refreshSchedule(state, link, true);
    saveState(state);
    fillTable(t, state, Date.now());
    t.reload();
  };
  t.addRow(change);
}

// ---------- main ----------
async function main() {
  const state = loadState();
  const now = Date.now();
  let link = getLink();

  if (config.runsInWidget) {
    const family = config.widgetFamily || "small";
    let w;
    if (!link) {
      w = family.startsWith("accessory") ? buildAccessory(state, now, family) : buildNoLink();
    } else {
      await refreshSchedule(state, link, false);
      saveState(state);
      const param = String(args.widgetParameter || "").toLowerCase();
      const wantsList = /list|full|plan|все|рас|роз/.test(param) || (!/next|najb|ближ|найб/.test(param) && family !== "small");
      if (family.startsWith("accessory")) w = buildAccessory(state, now, family);
      else if (wantsList) w = buildList(state, now, family === "large" || family === "extraLarge" ? 14 : 5);
      else w = buildNext(state, now);
      w.refreshAfterDate = nextRefresh(state, now);
    }
    Script.setWidget(w);
  } else {
    if (!link && config.runsInApp) {
      link = await askForLink("");
      if (link) setLink(link);
    }
    await refreshSchedule(state, link, true);
    saveState(state);
    if (config.runsInApp) {
      const t = new UITable();
      t.showSeparators = true;
      fillTable(t, state, now);
      await t.present();
    }
  }
  Script.complete();
}

await main();
