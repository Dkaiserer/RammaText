import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import mammoth from "mammoth";

export async function openDocxFile(): Promise<{ html: string; fileName: string } | null> {
  const path = await open({
    multiple: false,
    filters: [{ name: "Word dokumentum", extensions: ["docx"] }],
  });

  if (!path) return null;

  const filePath = path as string;
  const segments = filePath.replace(/\\/g, "/").split("/");
  const fileName = segments[segments.length - 1];

  const data = await readFile(filePath);

  const result = await mammoth.convertToHtml({
    arrayBuffer: data.buffer as ArrayBuffer,
  });

  return { html: result.value, fileName };
}