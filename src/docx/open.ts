import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import mammoth from "mammoth";

export async function openDocxFile(): Promise<{ html: string; fileName: string } | null> {
  const path = await open({
    multiple: false,
    filters: [{ name: "Word dokumentum", extensions: ["docx"] }],
  });

  if (!path || Array.isArray(path)) return null;

  const filePath = path;
  const fileName = filePath.split(/[/\\]/).pop() ?? "document.docx";

  const uint8 = await readFile(filePath);

  const arrayBuffer = new Uint8Array(uint8).buffer;

  const result = await mammoth.convertToHtml({ arrayBuffer });

  return {
    html: result.value,
    fileName,
  };
}