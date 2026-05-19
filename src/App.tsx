import { useState, useCallback } from "react";
import Editor from "./editor/Editor";
import Toolbar from "./editor/Toolbar.tsx";
import { openDocxFile } from "./docx/open";
import { saveDocx } from "./docx/save";
import { Editor as TiptapEditor } from "@tiptap/react";
import "./App.css";

export default function App() {
  const [content, setContent] = useState("<p>Kezdj el írni...</p>");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editorInstance, setEditorInstance] = useState<TiptapEditor | null>(null);

  const handleOpen = useCallback(async () => {
    const result = await openDocxFile();
    if (!result) return;
    setContent(result.html);
    setFileName(result.fileName);
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveDocx(content, fileName ?? "dokumentum.docx");
    } finally {
      setIsSaving(false);
    }
  }, [content, fileName]);

  const handleNew = useCallback(() => {
    setContent("<p></p>");
    setFileName(null);
  }, []);

  return (
    <div className="app-shell">
      {/* Title bar */}
      <div className="title-bar" data-tauri-drag-region>
        <div className="title-bar-left">
          <span className="app-logo">Rt</span>
          <span className="app-name">RammaText</span>
        </div>
        <div className="title-bar-center">
          <span className="doc-name">{fileName ?? "Névtelen dokumentum"}</span>
        </div>
        <div className="title-bar-right">
          <button className="titlebar-btn" onClick={handleNew} title="Új dokumentum">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            Új
          </button>
          <button className="titlebar-btn" onClick={handleOpen} title="Megnyitás">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            Megnyitás
          </button>
          <button className="titlebar-btn primary" onClick={handleSave} disabled={isSaving} title="Mentés">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            {isSaving ? "Mentés..." : "Mentés"}
          </button>
        </div>
      </div>

      {/* Formatting toolbar */}
      {editorInstance && (
        <Toolbar editor={editorInstance} />
      )}

      {/* Page area */}
      <div className="page-area">
        <div className="page-shadow">
          <div className="page">
            <Editor
              content={content}
              setContent={setContent}
              onEditorReady={setEditorInstance}
            />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <span className="status-item">Kész</span>
        <span className="status-item">A4</span>
      </div>
    </div>
  );
}