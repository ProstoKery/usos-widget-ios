// Runs UsosWidget.js in Node with a fake Scriptable API and checks what it draws.
// usage: node test/scriptable-sim.mjs   (no dependencies)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

process.env.TZ = "Europe/Warsaw";
const dir = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = fs.readFileSync(path.join(dir, "..", "UsosWidget.js"), "utf8");

// ---------- fixtures: a timetable around "now" ----------
function ics(changed) {
  const now = new Date(); now.setSeconds(0, 0); now.setMinutes(now.getMinutes() - (now.getMinutes() % 5));
  const p = n => String(n).padStart(2, "0");
  const f = d => `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
  const plus = (d, min) => new Date(d.getTime() + min * 60000);
  const day = (n, h, m) => { const d = new Date(now); d.setDate(d.getDate() + n); d.setHours(h, m, 0, 0); return d; };
  const run = plus(now, -30);
  let ev = [
    ["sm-1", "W - Sztuczna Inteligencja\; SPEC: Inżynieria Sztucznej Inteligenc\r\n ji", run, "114", 1],
    ["sm-2", "Lab - Uczenie maszynowe\; SPEC: Inżynieria Sztucznej Inteligencji", plus(run, 130), changed ? "A5" : "127 (Comp. Room)", 1],
    ["sm-3", "W - Logika rozmyta", day(1, 8, 0), "114", 1],
    ["sm-4", "Lab - Systemy operacyjne", day(1, changed ? 11 : 10, 10), "131 (Comp. Room)", 1],
    ["sm-5", "C - Rozproszone systemy komputerowe", day(2, 12, 30), "125 (Comp. Room)", 4],
  ];
  if (changed) ev = ev.filter(e => e[0] !== "sm-5");
  let out = "BEGIN:VCALENDAR\r\nX-WR-TIMEZONE:Europe/Warsaw\r\n";
  for (const [uid, sum, st, room, gr] of ev) {
    out += `BEGIN:VEVENT\r\nSUMMARY:${sum}\r\nDTSTART;VALUE=DATE-TIME:${f(st)}\r\nDTEND;VALUE=DATE-TIME:${f(plus(st, 115))}\r\n`;
    out += `UID:${uid}@usosapps.vistula.edu.pl\r\nDESCRIPTION:Sala: ${room}\\nVistula University\\n\\nhttp://usosweb.vistula.edu.pl/k\r\n ontroler.php?_action=x&gr_nr=${gr}&zaj_cyk_id=1\\n\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\n`;
  }
  return out + "END:VCALENDAR\r\n";
}
const LINK = "https://usosapps.vistula.edu.pl/services/tt/upcoming_ical?lang=pl&user_id=1&key=TEST";

// ---------- fake Scriptable ----------
function makeEnv({ lang, keychain, files, server, alerts, runsInWidget, family, param, notifications, log }) {
  class Elem { constructor(kind, value) { this.kind = kind; this.value = value; this.children = []; }
    addText(v) { const e = new Elem("text", v); e.centerAlignText = () => {}; this.children.push(e); return e; }
    addStack() { const e = new Elem("stack"); this.children.push(e); return e; }
    addSpacer() { this.children.push(new Elem("spacer")); }
    bottomAlignContent() {} setPadding() {} }
  const env = {
    Device: { language: () => lang },
    Keychain: { contains: k => k in keychain, get: k => keychain[k], set: (k, v) => { keychain[k] = v; } },
    FileManager: { local: () => ({ joinPath: (a, b) => `${a}/${b}`, documentsDirectory: () => "/docs",
      fileExists: p => p in files, readString: p => files[p], writeString: (p, s) => { files[p] = s; } }) },
    Request: class { constructor(u) { this.u = u; } async loadString() { log.push(`GET ${this.u}`); return server(this.u); } },
    Notification: class { async schedule() { notifications.push(`${this.title}\n${this.body}`); } },
    Alert: class { constructor() { this.fields = []; } addTextField(p, v) { this.fields.push(v); } addAction() {} addCancelAction() {}
      async presentAlert() { const a = alerts.shift(); if (a === undefined) return -1; if (a === null) return -1; this.answer = a; return 0; }
      textFieldValue() { return this.answer; } },
    UITable: class { constructor() { this.rows = []; } addRow(r) { this.rows.push(r); } removeAllRows() { this.rows = []; } reload() {}
      async present() { env.__table = this; } },
    UITableRow: class { constructor() { this.cells = []; } addText(a, b) { const c = { a, b }; this.cells.push(c); return c; } },
    ListWidget: class extends Elem { constructor() { super("widget"); } },
    Font: { boldSystemFont: s => `bold${s}`, systemFont: s => `reg${s}` },
    Color: class { constructor(h) { this.h = h; } },
    Script: { setWidget: w => { env.__widget = w; }, complete: () => {} },
    URLScheme: { forRunningScript: () => "scriptable:///run/USOS%20Widget" },
    config: { runsInWidget, runsInApp: !runsInWidget, widgetFamily: family },
    args: { widgetParameter: param || null },
  };
  return env;
}

async function run(opts) {
  const env = makeEnv(opts);
  const fn = new Function(...Object.keys(env).filter(k => !k.startsWith("__")),
    `return (async () => {\n${SCRIPT}\n})();`);
  await fn(...Object.keys(env).filter(k => !k.startsWith("__")).map(k => env[k]));
  return env;
}

function texts(e, out = []) { if (e.kind === "text") out.push(e.value); for (const c of e.children || []) texts(c, out); return out; }
let failures = 0;
const check = (cond, msg) => { console.log(`${cond ? "  ✓" : "  ✗"} ${msg}`); if (!cond) failures++; };

// ---------- scenarios ----------
const keychain = {}, files = {}, notifications = [], log = [];
let calendar = ics(false);
const server = u => { if (u.includes("broken")) return "<html>login</html>"; return calendar; };
const base = { lang: "ru", keychain, files, server, notifications, log };

console.log("1. Widget before setup");
let env = await run({ ...base, alerts: [], runsInWidget: true, family: "small" });
check(texts(env.__widget).some(t => /ссылку из USOS/.test(t)), "small widget asks to paste the link");

console.log("2. First run in the app: paste text with the link");
env = await run({ ...base, alerts: [`мой план ${LINK} `], runsInWidget: false });
check(keychain["usos-widget-link"] === LINK, "link extracted and saved to Keychain");
const rows = env.__table.rows.map(r => r.cells.map(c => c.a).join(" | "));
check(rows.some(r => /Sztuczna Inteligencja/.test(r)), "app list shows classes");
check(rows.some(r => /Изменить ссылку/.test(r)), "app list has 'change link'");
console.log("     " + rows.slice(0, 5).join("\n     "));

console.log("3. Widgets after setup (ru)");
log.length = 0;
env = await run({ ...base, alerts: [], runsInWidget: true, family: "small" });
check(log.length === 0, "fresh data → widget does not download again");
let t = texts(env.__widget);
check(t[0] === "Sztuczna Inteligencja" && t[1] === "W, gr. 1 (114)" && /^до \d+:\d\d$/.test(t[t.length - 1]), `small: ${JSON.stringify(t)}`);
check(env.__widget.url === "scriptable:///run/USOS%20Widget", "tap on widget runs the script");
check(env.__widget.refreshAfterDate instanceof Date, "asks iOS to refresh at the next class boundary");
env = await run({ ...base, alerts: [], runsInWidget: true, family: "medium" });
t = texts(env.__widget);
check(t[0] === "Расписание" && t.some(x => x.startsWith("Сегодня ·")) && t.includes("сейчас"), `medium: ${JSON.stringify(t)}`);
env = await run({ ...base, alerts: [], runsInWidget: true, family: "large" });
check(texts(env.__widget).some(x => x.startsWith("Завтра ·")), "large shows tomorrow");
env = await run({ ...base, alerts: [], runsInWidget: true, family: "medium", param: "next" });
check(texts(env.__widget)[0] === "Sztuczna Inteligencja", "parameter 'next' on a medium widget");
for (const fam of ["accessoryRectangular", "accessoryInline", "accessoryCircular"]) {
  env = await run({ ...base, alerts: [], runsInWidget: true, family: fam });
  console.log(`     ${fam}: ${JSON.stringify(texts(env.__widget))}`);
  check(texts(env.__widget).length > 0, `lock screen ${fam}`);
}

console.log("4. Languages");
for (const [lang, word] of [["pl", "Plan zajęć"], ["uk", "Розклад"], ["en", "Timetable"], ["de", "Timetable"]]) {
  env = await run({ ...base, lang, alerts: [], runsInWidget: true, family: "medium" });
  check(texts(env.__widget)[0] === word, `${lang} → "${texts(env.__widget)[0]}"`);
}

console.log("5. Timetable change → one notification");
calendar = ics(true);
env = await run({ ...base, alerts: [], runsInWidget: false });   // tap on widget = run in app
check(notifications.length === 1, `notification: ${JSON.stringify(notifications[0])}`);

console.log("6. Wrong link");
// "not a link" → error alert ("OK") → asks again → a link that is not a calendar
env = await run({ ...base, alerts: ["not a link", "OK", "https://example.com/broken"], runsInWidget: false, keychain: {}, files: {} });
check(env.__table.rows.some(r => r.cells.some(c => /не ссылка на расписание/.test(c.a))), "shows 'not a USOS calendar'");

console.log("7. Change link from the list");
const k2 = {}, f2 = {}, queue = [LINK];
env = await run({ ...base, keychain: k2, files: f2, alerts: queue, runsInWidget: false });
const changeRow = env.__table.rows.find(r => r.onSelect);
const NEW = "https://usosapps.vistula.edu.pl/services/tt/upcoming_ical?user_id=2&key=NEW";
queue.push(NEW);
log.length = 0;
await changeRow.onSelect();
check(k2["usos-widget-link"] === NEW, "new link saved");
check(log.some(l => l.includes("key=NEW")), "timetable downloaded with the new link");
check(env.__table.rows.some(r => r.cells.some(c => /Sztuczna/.test(c.a))), "list rebuilt");

console.log("8. English USOSweb and other universities");
{
  const fn = new Function("Device", "Color", "FileManager", SCRIPT.split("// ---------- main ----------")[0] + "\nreturn describe;");
  const describe = fn({ language: () => "en" }, class {}, { local: () => ({ joinPath: (a, b) => a + b, documentsDirectory: () => "" }) });
  const a = describe("W - Artificial Intelligence; SPEC: Engineering of Artificial Intelligence", "Room: 127 (Comp. Room)\nVistula University\n\nhttp://x/k?gr_nr=1");
  check(a.title === "Artificial Intelligence" && a.detail === "W, gr. 1 (127)", `English: ${JSON.stringify(a)}`);
  const b = describe("Wykład - Analiza matematyczna I", "Sala: 2.14\nWydział Matematyki");
  check(b.title === "Analiza matematyczna I" && b.detail === "Wykład (2.14)", `other university: ${JSON.stringify(b)}`);
  const c = describe("Analiza danych - projekt zespołowy", "");
  check(c.title === "Analiza danych - projekt zespołowy" && c.detail === "", `course name with a dash: ${JSON.stringify(c)}`);
}

console.log(failures ? `\n${failures} FAILED` : "\nALL OK");
process.exit(failures ? 1 : 0);
