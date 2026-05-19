import { Editor } from "@tiptap/react";
import { useCallback, useRef } from "react";

interface Props { editor: Editor; }

const FONT_SIZES = ["8","9","10","11","12","14","16","18","20","24","28","32","36","48","72"];

function Icon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function Toolbar({ editor }: Props) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL:", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const currentFontSize = () => {
    const attrs = editor.getAttributes("textStyle");
    if (!attrs.fontSize) return "12";
    return parseInt(attrs.fontSize).toString();
  };

  const getHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  };

  return (
    <div className="toolbar">
      {/* Paragraph style */}
      <select
        className="tb-heading-select"
        value={getHeadingValue()}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "p") editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: parseInt(val[1]) as 1|2|3 }).run();
        }}
      >
        <option value="p">Normál szöveg</option>
        <option value="h1">Cím 1</option>
        <option value="h2">Cím 2</option>
        <option value="h3">Cím 3</option>
      </select>

      <div className="toolbar-separator" />

      {/* Font size */}
      <select
        className="tb-select"
        value={currentFontSize()}
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value + "pt").run()}
        style={{ width: 52 }}
      >
        {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="toolbar-separator" />

      {/* Bold / Italic / Underline / Strike */}
      <button
        className={`tb-btn${editor.isActive("bold") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        title="Félkövér (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        className={`tb-btn${editor.isActive("italic") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        title="Dőlt (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        className={`tb-btn${editor.isActive("underline") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
        title="Aláhúzott (Ctrl+U)"
      >
        <span style={{ textDecoration: "underline" }}>U</span>
      </button>
      <button
        className={`tb-btn${editor.isActive("strike") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        title="Áthúzott"
      >
        <span style={{ textDecoration: "line-through" }}>S</span>
      </button>

      <div className="toolbar-separator" />

      {/* Text color */}
      <button
        className="color-btn-wrapper"
        onMouseDown={(e) => { e.preventDefault(); colorInputRef.current?.click(); }}
        title="Betűszín"
      >
        <svg width="12" height="14" viewBox="0 0 24 24" fill="currentColor">
          <text x="2" y="18" fontSize="20" fontFamily="Georgia" fontWeight="700">A</text>
        </svg>
        <div className="color-stripe" style={{ background: editor.getAttributes("textStyle").color ?? "#000000" }} />
      </button>
      <input
        ref={colorInputRef}
        type="color"
        style={{ display: "none" }}
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />

      {/* Highlight */}
      <button
        className="color-btn-wrapper"
        onMouseDown={(e) => { e.preventDefault(); highlightInputRef.current?.click(); }}
        title="Kiemelés"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        <div className="color-stripe" style={{ background: "#FFFF00" }} />
      </button>
      <input
        ref={highlightInputRef}
        type="color"
        defaultValue="#FFFF00"
        style={{ display: "none" }}
        onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
      />

      <div className="toolbar-separator" />

      {/* Alignment */}
      <button
        className={`tb-btn${editor.isActive({ textAlign: "left" }) ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("left").run(); }}
        title="Balra igazítás"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
        </svg>
      </button>
      <button
        className={`tb-btn${editor.isActive({ textAlign: "center" }) ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("center").run(); }}
        title="Középre igazítás"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
        </svg>
      </button>
      <button
        className={`tb-btn${editor.isActive({ textAlign: "right" }) ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("right").run(); }}
        title="Jobbra igazítás"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <button
        className={`tb-btn${editor.isActive({ textAlign: "justify" }) ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign("justify").run(); }}
        title="Sorkizárás"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div className="toolbar-separator" />

      {/* Lists */}
      <button
        className={`tb-btn${editor.isActive("bulletList") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
        title="Felsorolás"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/>
          <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/>
          <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>
        </svg>
      </button>
      <button
        className={`tb-btn${editor.isActive("orderedList") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
        title="Számozott lista"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
          <path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeWidth="1.5"/>
        </svg>
      </button>

      <div className="toolbar-separator" />

      {/* Blockquote */}
      <button
        className={`tb-btn${editor.isActive("blockquote") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
        title="Idézet"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
      </button>

      {/* Link */}
      <button
        className={`tb-btn${editor.isActive("link") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); setLink(); }}
        title="Hivatkozás"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      </button>

      {/* Code */}
      <button
        className={`tb-btn${editor.isActive("code") ? " active" : ""}`}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleCode().run(); }}
        title="Kód"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>
        </svg>
      </button>

      <div className="toolbar-separator" />

      {/* Undo / Redo */}
      <button
        className="tb-btn"
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
        disabled={!editor.can().undo()}
        title="Visszavonás (Ctrl+Z)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>
        </svg>
      </button>
      <button
        className="tb-btn"
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
        disabled={!editor.can().redo()}
        title="Újra (Ctrl+Y)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>
        </svg>
      </button>

      {/* Clear formatting */}
      <button
        className="tb-btn"
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().clearNodes().unsetAllMarks().run(); }}
        title="Formázás törlése"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          <line x1="18" y1="12" x2="22" y2="12" strokeDasharray="2"/>
        </svg>
      </button>
    </div>
  );
}