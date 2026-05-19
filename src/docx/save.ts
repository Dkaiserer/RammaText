import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, UnderlineType,
} from "docx";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

// ── Minimal HTML → docx converter ──────────────────────────────────────────
function parseInlineHtml(html: string): TextRun[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const runs: TextRun[] = [];

  function walk(node: Node, bold = false, italic = false, underline = false, strike = false, color?: string) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (text) {
        runs.push(new TextRun({
          text,
          bold,
          italics: italic,
          underline: underline ? { type: UnderlineType.SINGLE } : undefined,
          strike,
          color: color?.replace("#", ""),
        }));
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const isBold = bold || tag === "strong" || tag === "b";
    const isItalic = italic || tag === "em" || tag === "i";
    const isUnderline = underline || tag === "u";
    const isStrike = strike || tag === "s" || tag === "del";
    const elColor = el.style.color || color;
    el.childNodes.forEach(child => walk(child, isBold, isItalic, isUnderline, isStrike, elColor));
  }

  div.childNodes.forEach(n => walk(n));
  return runs.length ? runs : [new TextRun({ text: "" })];
}

function htmlToDocxChildren(html: string): Paragraph[] {
  const div = document.createElement("div");
  div.innerHTML = html;
  const paragraphs: Paragraph[] = [];

  div.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      const text = node.textContent?.trim();
      if (text) paragraphs.push(new Paragraph({ children: [new TextRun({ text })] }));
      return;
    }
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const inner = el.innerHTML;
    const textContent = el.textContent ?? "";

    const alignMap = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
      justify: AlignmentType.JUSTIFIED,
    } as const;
      const align = alignMap[el.style.textAlign as keyof typeof alignMap] ?? AlignmentType.LEFT;

    if (tag === "h1") {
      paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: parseInlineHtml(inner), alignment: align }));
    } else if (tag === "h2") {
      paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: parseInlineHtml(inner), alignment: align }));
    } else if (tag === "h3") {
      paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: parseInlineHtml(inner), alignment: align }));
    } else if (tag === "p") {
      paragraphs.push(new Paragraph({ children: parseInlineHtml(inner), alignment: align }));
    } else if (tag === "ul") {
      el.querySelectorAll("li").forEach((li) => {
        paragraphs.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: li.textContent ?? "" })],
        }));
      });
    } else if (tag === "ol") {
      el.querySelectorAll("li").forEach((li, idx) => {
        paragraphs.push(new Paragraph({
          numbering: { reference: "default-numbering", level: 0 },
          children: [new TextRun({ text: li.textContent ?? "" })],
        }));
      });
    } else if (tag === "blockquote") {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: textContent, italics: true, color: "605E5C" })],
        indent: { left: 720 },
      }));
    } else {
      if (textContent.trim()) {
        paragraphs.push(new Paragraph({ children: parseInlineHtml(inner) }));
      }
    }
  });

  return paragraphs.length ? paragraphs : [new Paragraph({ children: [new TextRun({ text: "" })] })];
}

// ── Main save function ───────────────────────────────────────────────────────
export async function saveDocx(html: string, defaultName = "dokumentum.docx"): Promise<void> {
  const children = htmlToDocxChildren(html);

  const doc = new Document({
    numbering: {
      config: [{
        reference: "default-numbering",
        levels: [{
          level: 0,
          format: "decimal",
          text: "%1.",
          alignment: AlignmentType.LEFT,
        }],
      }],
    },
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const arrayBuffer = await blob.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  const savePath = await save({
    defaultPath: defaultName,
    filters: [{ name: "Word dokumentum", extensions: ["docx"] }],
  });

  if (!savePath) return;

  await writeFile(savePath, uint8);
}