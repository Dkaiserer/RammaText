import { open, save } from "@tauri-apps/plugin-dialog";
import { readFile, writeFile } from "@tauri-apps/plugin-fs";

export async function openFile() {
  const path = await open();
  if (!path) return null;

  const data = await readFile(path as string);
  return { path, data };
}

export async function saveFile(blob: Uint8Array) {
  const path = await save();
  if (!path) return;

  await writeFile(path, blob);
}