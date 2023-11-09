import Image from "@tiptap/extension-image";
import { Plugin } from "@tiptap/pm/state";

export default Image.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleClick() {},
        },
      }),
    ];
  },
});
