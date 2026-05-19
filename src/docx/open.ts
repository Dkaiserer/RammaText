import mammoth from "mammoth";

export async function openDocx(file: File) {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.convertToHtml({ arrayBuffer });

  return result.value;
}