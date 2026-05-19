import { Document, Packer, Paragraph } from "docx";

export async function saveDocx(text: string) {
  const doc = new Document({
    sections: [
      {
        children: [new Paragraph(text)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}