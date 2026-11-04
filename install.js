// USOS Widget — installer for Scriptable.
// Paste into a new script in Scriptable and tap ▶. It downloads "USOS Widget" and starts it.
// Run it again any time to update to the newest version (your USOS link stays saved).
const url = "https://raw.githubusercontent.com/ProstoKery/usos-widget-ios/main/UsosWidget.js";
let fm = FileManager.local();
try { const ic = FileManager.iCloud(); if (ic.isFileStoredIniCloud(module.filename)) fm = ic; } catch (e) {}
const code = await new Request(url).loadString();
if (!code.includes("USOS Widget")) throw new Error("Download failed — check the internet and try again.");
fm.writeString(fm.joinPath(fm.documentsDirectory(), "USOS Widget.js"), code);
Safari.open("scriptable:///run/" + encodeURIComponent("USOS Widget"));
