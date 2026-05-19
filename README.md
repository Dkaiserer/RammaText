# 📝 RammaText

A RammaText egy könnyű, Szövegszerkesztő, amely **Tauri + React + TypeScript** segítségével készült.  
A program képes formázott szöveget `.docx` fájlba exportálni.

---

## 🚀 Funkciók

- 🖊️ Rich text szerkesztés (HTML alapú)
- 📄 Export `.docx` (Microsoft Word formátum)
- 💾 Natív “Mentés másként” ablak (Tauri dialog)
- 🎨 Alap formázások:
  - Félkövér (Bold)
  - Dőlt (Italic)
  - Aláhúzott (Underline)
  - Áthúzott (Strikethrough)
  - Címsorok (H1–H3)
  - Lista (sorszámozott / pontozott)

- ⚡ Gyors desktop alkalmazás (Rust + WebView)

---

## 🧱 Technológiák

- **Frontend:** React + TypeScript
- **Backend:** Rust (Tauri v2)
- **DOCX generálás:** `docx` npm package
- **Fájlrendszer:** `@tauri-apps/plugin-fs`
- **Dialog:** `@tauri-apps/plugin-dialog`
