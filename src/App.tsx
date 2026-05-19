import Editor from "./editor/Editor";
import "./App.css";

function App() {
  return (
    <main className="h-screen flex flex-col">
      
      {/* HEADER / TOOLBAR HELYE */}
      <div className="flex items-center justify-between p-2 border-b">
        <h1 className="text-lg font-semibold">RammaText</h1>

        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">
            Open
          </button>

          <button className="px-3 py-1 border rounded">
            Save
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className="flex-1 overflow-auto p-4">
        <Editor />
      </div>

    </main>
  );
}

export default App;