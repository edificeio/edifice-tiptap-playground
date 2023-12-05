import { ImageExtend } from "@edifice-tiptap-extensions/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";

const ImageResize = (Component: any) =>
  ImageExtend.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Component);
    },
  });

export default ImageResize;
export { ImageResize };
