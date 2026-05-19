import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

export const Pagination = Extension.create({
  name: "pagination",

  addStorage() {
    return {
      pageHeightPx: 1122,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        view: (view) => {
          return {
            update(view) {
              const dom = view.dom as HTMLElement;

              requestAnimationFrame(() => {
                const pages = Math.ceil(
                  dom.scrollHeight / 1122
                );

                dom.style.setProperty("--page-count", String(pages));
              });
            },
          };
        },
      }),
    ];
  },
});