import { Linker } from "@edifice-tiptap-extensions/extension-linker";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { LinkerRenderer } from "./LinkerRenderer";

const LinkerNodeView = Linker.extend({
  addNodeView() {
    return ReactNodeViewRenderer(LinkerRenderer);
  },
});

export default LinkerNodeView;
